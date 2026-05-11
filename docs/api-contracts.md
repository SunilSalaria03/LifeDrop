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

### Verify Profile Phone OTP

```http
POST /api/v1/auth/otp/verify-profile-phone
Cookie: access_token=<HttpOnly cookie>
```

Request:

```json
{
  "phone": "+919999999999",
  "otp": "123456"
}
```

Behavior:
- Protected route for logged-in Google users who need a verified phone number.
- Verifies the OTP and attaches the phone to the current user.
- Prevents using a phone number that belongs to another account.
- Marks `phoneVerified` true and returns the safe current user.

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
- Set HttpOnly `access_token` and `refresh_token` cookies.
- Return only the safe user object.
- Frontend redirects to `/profile/setup` when `phoneVerified` is false.

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
- Set HttpOnly `access_token` and `refresh_token` cookies and return only the safe user object.

### Refresh Token

```http
POST /api/v1/auth/refresh
```

Behavior:
- Read the refresh token from the HttpOnly `refresh_token` cookie.
- Verify refresh token using `JWT_REFRESH_SECRET`.
- Compare token hash with the stored user refresh token.
- Rotate the refresh token by storing the new refresh-token hash.
- Set a new HttpOnly cookie pair and return only the safe user object.

### Logout

```http
POST /api/v1/auth/logout
Cookie: access_token=<HttpOnly cookie>
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
Cookie: access_token=<HttpOnly cookie>
```

Response data is the logged-in safe user object. It never includes `refreshToken` or hidden provider identifiers.

### User Profile

```http
GET /api/v1/users/profile
Cookie: access_token=<HttpOnly cookie>
```

Returns the logged-in user's safe profile from MongoDB.

```http
PUT /api/v1/users/profile
Cookie: access_token=<HttpOnly cookie>
```

Updates the logged-in user's real profile fields in the `users` collection, including name, contact fields, address text, state, city, district, and optional GeoJSON location. Coordinates must be supplied together as `lat` and `lng` and are stored as `[lng, lat]`. The response never includes `refreshToken`, OTP fields, or hidden provider identifiers.

Profile completion is set when required safe auth fields are present: `name`, `phone`, and `phoneVerified`. Blocked users cannot update their profile. Normal profile updates use only basic fields; donor-only fields are accepted through donor profile APIs.

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
Cookie: access_token=<HttpOnly admin cookie>
```

Admin-only. Creates a location record with optional GeoJSON coordinates stored as `[lng, lat]`.

### Bulk Create Locations

```http
POST /api/v1/locations/bulk
Cookie: access_token=<HttpOnly admin cookie>
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
Cookie: access_token=<HttpOnly cookie>
```

Creates the logged-in user's donor profile in `donorprofiles`, stores location as GeoJSON `[lng, lat]`, calculates `nextEligibleDate` from `lastDonationDate + 90 days` when supplied, syncs safe profile/location fields back to the linked user, and promotes the user role to `donor`. Blocked users cannot create donor profiles. A user can have only one donor profile.

### Update Donor Profile

```http
PUT /api/v1/donors/profile
Cookie: access_token=<HttpOnly cookie>
```

Updates only the logged-in user's donor profile. Coordinates must be supplied as both `lat` and `lng` when changing donor location.

### Current Donor Profile

```http
GET /api/v1/donors/profile/me
Cookie: access_token=<HttpOnly cookie>
```

Returns the logged-in user's donor profile.

### Donor Availability

```http
PATCH /api/v1/donors/profile/availability
Cookie: access_token=<HttpOnly cookie>
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
- `radiusKm` defaults to `50` and is capped at `50`.
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

### Auth Cookie Settings

The backend stores tokens in cookies that are not readable by frontend JavaScript:

- `access_token`: HttpOnly, `sameSite: "lax"`, `path: "/"`, 15 minute max age
- `refresh_token`: HttpOnly, `sameSite: "lax"`, `path: "/"`, 7 day max age
- `secure: true` only in production

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
      "phoneVerified": true,
      "isProfileCompleted": false,
      "isBlocked": false
    }
  },
  "timestamp": "2026-05-04T00:00:00.000Z",
  "path": "/api/v1/auth/otp/verify"
}
```

## Planned Contracts
- Blood request creation and lifecycle updates
- Notification-ready emergency events
- Admin-ready management endpoints
