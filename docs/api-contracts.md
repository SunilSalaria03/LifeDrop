# LifeDrop API Contracts

## Base URL
Backend APIs are served under:

```text
/api/v1
```

## Current Contracts
### Auth Health

```http
GET /api/v1/auth/health
```

Response:

```json
{
  "success": true,
  "data": {
    "module": "auth",
    "status": "ready"
  },
  "timestamp": "2026-05-04T00:00:00.000Z",
  "path": "/api/v1/auth/health"
}
```

### Send Phone OTP

```http
POST /api/v1/auth/otp/send
```

Request:

```json
{
  "phone": "+919999999999"
}
```

Response:

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "timestamp": "2026-05-04T00:00:00.000Z",
  "path": "/api/v1/auth/otp/send"
}
```

Behavior:
- Create a minimal phone user when missing.
- Login the existing phone user when found.
- Send OTP SMS through Twilio.
- Do not return tokens until OTP verification succeeds.
- Frontend redirects to `/auth/otp?phone=...`.
- OTP is valid for 10 minutes.
- Resend is limited to once every 60 seconds.
- Twilio max-send-attempt errors return `429` and do not affect other API routes.

### Verify Phone OTP

```http
POST /api/v1/auth/otp/verify
```

Request:

```json
{
  "phone": "+919999999999",
  "otp": "123456"
}
```

Behavior:
- Verify OTP through Twilio Verify when configured.
- Verify locally stored development OTP only when Twilio Verify is not configured and the app is not production.
- Reject expired OTPs after 10 minutes.
- Reject verification after repeated invalid attempts.
- Return safe user, access token, and refresh token.
- Frontend redirects to onboarding when `isProfileCompleted` is false.

### Google Auth

```http
POST /api/v1/auth/google
```

Request:

```json
{
  "idToken": "google_oauth_or_firebase_google_id_token"
}
```

Behavior:
- Verify Firebase Google sign-in ID token when supplied.
- Otherwise verify direct Google OAuth ID token using `GOOGLE_CLIENT_ID`.
- Find user by `googleId` or email.
- Create user when missing.
- Login existing user when found.
- Blocked users cannot login.

### Refresh Token

```http
POST /api/v1/auth/refresh
```

Request:

```json
{
  "refreshToken": "token"
}
```

Behavior:
- Verify refresh token using `JWT_REFRESH_SECRET`.
- Compare token hash with the stored user refresh token.
- Return a new access token and refresh token.

### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer access_token
```

Response:

```json
{
  "success": true,
  "message": "Logged out successfully",
  "timestamp": "2026-05-04T00:00:00.000Z",
  "path": "/api/v1/auth/logout"
}
```

### Current User

```http
GET /api/v1/auth/me
Authorization: Bearer access_token
```

Response data is the logged-in safe user object. It never includes `refreshToken` or hidden provider identifiers.

### User Profile

```http
GET /api/v1/users/profile
Authorization: Bearer access_token
```

Returns the logged-in user's safe profile from MongoDB.

```http
PUT /api/v1/users/profile
Authorization: Bearer access_token
```

Updates the logged-in user's real profile fields in the `users` collection, including name, contact fields, address text, state, city, district, and optional GeoJSON location. Coordinates must be supplied together as `lat` and `lng` and are stored as `[lng, lat]`. The response never includes `refreshToken`, OTP fields, or hidden provider identifiers.

### Location States

```http
GET /api/v1/locations/states
```

Returns active states from the `locations` collection.

### Location Districts

```http
GET /api/v1/locations/districts?state=Punjab
```

Returns active districts for the supplied state from MongoDB.

### Location Cities

```http
GET /api/v1/locations/cities?state=Punjab&district=Mohali
```

Returns active cities from MongoDB. `district` can be supplied to narrow the result.

### Create Location

```http
POST /api/v1/locations
Authorization: Bearer admin_access_token
```

Admin-only. Creates a location record with optional GeoJSON coordinates stored as `[lng, lat]`.

### Bulk Create Locations

```http
POST /api/v1/locations/bulk
Authorization: Bearer admin_access_token
```

Admin-only. Upserts location records into the `locations` collection.

### Search Locations

```http
GET /api/v1/locations/search?keyword=Chandigarh
```

Returns active city, district, state, or pincode matches from MongoDB.

### Create Donor Profile

```http
POST /api/v1/donors/profile
Authorization: Bearer access_token
```

Creates the logged-in user's donor profile in `donorprofiles`, stores location as GeoJSON `[lng, lat]`, calculates `nextEligibleDate` from `lastDonationDate + 90 days`, and syncs safe profile/location fields back to the linked user. Blocked users cannot create donor profiles.

### Update Donor Profile

```http
PUT /api/v1/donors/profile
Authorization: Bearer access_token
```

Updates only the logged-in user's donor profile. Coordinates must be supplied as both `lat` and `lng` when changing donor location.

### Current Donor Profile

```http
GET /api/v1/donors/profile/me
Authorization: Bearer access_token
```

Returns the logged-in user's donor profile.

### Donor Availability

```http
PATCH /api/v1/donors/profile/availability
Authorization: Bearer access_token
```

Request:

```json
{
  "isAvailable": true
}
```

### Donor Search

```http
GET /api/v1/donors/search?bloodGroup=O%2B&lat=30.7333&lng=76.7794&radiusKm=10
GET /api/v1/donors/search?bloodGroup=O%2B&state=Punjab&city=Chandigarh
```

Behavior:
- `bloodGroup` is required.
- `radiusKm` defaults to `5` and is capped at `50`.
- `lat` and `lng` must be supplied together.
- Geo search uses MongoDB `$geoNear`; manual search filters real DB donor profiles by state, city, and district.
- Results include only active, available, eligible donors whose linked user is not blocked.
- Search results never expose `phone`, `alternatePhone`, `refreshToken`, OTP fields, or hidden provider identifiers.

Response data:

```json
{
  "items": [
    {
      "id": "donorProfileId",
      "userId": "userId",
      "name": "Rahul Sharma",
      "profileImage": "",
      "bloodGroup": "O+",
      "state": "Punjab",
      "city": "Chandigarh",
      "district": "Chandigarh",
      "distanceKm": 2.4,
      "isAvailable": true,
      "isVerified": true,
      "lastDonationDate": "2025-12-01T00:00:00.000Z",
      "nextEligibleDate": "2026-03-01T00:00:00.000Z",
      "totalDonations": 3,
      "createdAt": "2026-05-05T00:00:00.000Z",
      "updatedAt": "2026-05-05T00:00:00.000Z"
    }
  ],
  "count": 1,
  "radiusKm": 10
}
```

### Donor Public Profile

```http
GET /api/v1/donors/:id
```

Returns a privacy-safe donor profile for the `/donors/[id]` frontend route. Phone numbers are not exposed by default.

Response data includes safe public fields such as donor id, user id, name, profile image, blood group, state, city, district, availability, verification status, last donation date, next eligible date, total donations, and timestamps. It does not include `phone` or `alternatePhone`.

### Auth Success Response Shape

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "name": "LifeDrop User",
      "email": "user@example.com",
      "phone": "+919999999999",
      "profileImage": "https://example.com/image.png",
      "authProvider": "phone",
      "role": "user",
      "isPhoneVerified": true,
      "isProfileCompleted": false,
      "isBlocked": false
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  },
  "timestamp": "2026-05-04T00:00:00.000Z",
  "path": "/api/v1/auth/otp/verify"
}
```

## Planned Contracts
- Blood request creation and lifecycle updates
- Notification-ready emergency events
- Admin-ready management endpoints
