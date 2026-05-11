# LifeDrop Swagger API Endpoints

Swagger UI:

```text
http://localhost:5000/api/v1/docs
```

Base URL:

```text
http://localhost:5000/api/v1
```

## Auth Rules

Use no token for public APIs.

Protected user APIs read the JWT access token from the HttpOnly `access_token` cookie set by login, Google auth, or refresh.

Admin APIs require:
- Valid JWT access token
- User role: `admin`

Supported roles:
- `user`
- `donor`
- `admin`

Standard response wrapper:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-05-05T00:00:00.000Z",
  "path": "/api/v1/example"
}
```

## Auth APIs

### Health

```http
GET /auth/health
```

Access: Public

Payload: none

### Send Phone OTP

```http
POST /auth/otp/send
```

Access: Public

Payload:

```json
{
  "phone": "+919999999999"
}
```

Notes:
- `phone` must be E.164 format.
- Tokens are not returned from this API.

### Verify Phone OTP

```http
POST /auth/otp/verify
```

Access: Public

Payload:

```json
{
  "phone": "+919999999999",
  "otp": "123456"
}
```

Returns:
- Safe user object

Also sets HttpOnly `access_token` and `refresh_token` cookies.

### Google Auth

```http
POST /auth/google
```

Access: Public

Payload:

```json
{
  "idToken": "google-or-firebase-id-token"
}
```

Returns:
- Safe user object

Also sets HttpOnly `access_token` and `refresh_token` cookies.

### Refresh Token

```http
POST /auth/refresh
```

Access: Public

Payload: none

Reads the HttpOnly `refresh_token` cookie, rotates the refresh token, sets a new cookie pair, and returns the safe user object.

### Logout

```http
POST /auth/logout
Cookie: access_token=<HttpOnly cookie>
```

Access: Protected

Role: `user`, `donor`, or `admin`

Payload: none

### Current Auth User

```http
GET /auth/me
Cookie: access_token=<HttpOnly cookie>
```

Access: Protected

Role: `user`, `donor`, or `admin`

Payload: none

## User APIs

### Get User Profile

```http
GET /users/profile
Cookie: access_token=<HttpOnly cookie>
```

Access: Protected

Role: `user`, `donor`, or `admin`

Payload: none

Sensitive fields not returned:
- `refreshToken`
- `googleId`
- OTP fields

### Update User Profile

```http
PUT /users/profile
Cookie: access_token=<HttpOnly cookie>
```

Access: Protected

Role: `user`, `donor`, or `admin`

Payload:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+919999999999",
  "profileImage": "https://example.com/profile.jpg",
  "addressText": "Sector 17",
  "state": "Punjab",
  "city": "Chandigarh",
  "district": "Chandigarh",
  "lat": 30.7333,
  "lng": 76.7794
}
```

Notes:
- All fields are optional.
- If `lat` is provided, `lng` is also required.
- If `lng` is provided, `lat` is also required.
- GeoJSON is stored in MongoDB as `[lng, lat]`.

## Donor APIs

### Create Donor Profile

```http
POST /donors/profile
Cookie: access_token=<HttpOnly cookie>
```

Access: Protected

Role: `user`, `donor`, or `admin`

Payload:

```json
{
  "bloodGroup": "O+",
  "phone": "+919999999999",
  "alternatePhone": "+918888888888",
  "state": "Punjab",
  "city": "Chandigarh",
  "district": "Chandigarh",
  "addressText": "Sector 17, Chandigarh",
  "lat": 30.7333,
  "lng": 76.7794,
  "lastDonationDate": "2025-12-01",
  "isAvailable": true
}
```

Required:
- `bloodGroup`
- `phone`
- `state`
- `city`
- `lat`
- `lng`

Valid blood groups:

```text
A+, A-, B+, B-, AB+, AB-, O+, O-
```

Notes:
- Uses logged-in user from JWT.
- One donor profile per user.
- Blocked users cannot create donor profiles.
- `nextEligibleDate` is calculated as `lastDonationDate + 90 days`.
- Location is stored as GeoJSON `[lng, lat]`.

### Update Donor Profile

```http
PUT /donors/profile
Cookie: access_token=<HttpOnly cookie>
```

Access: Protected

Role: `donor`, `user`, or `admin`

Payload:

```json
{
  "bloodGroup": "O+",
  "phone": "+919999999999",
  "alternatePhone": "+918888888888",
  "state": "Punjab",
  "city": "Chandigarh",
  "district": "Chandigarh",
  "addressText": "Sector 22, Chandigarh",
  "lat": 30.7333,
  "lng": 76.7794,
  "lastDonationDate": "2025-12-01",
  "isAvailable": true
}
```

Notes:
- All fields are optional.
- User can update only their own donor profile.
- If changing coordinates, send both `lat` and `lng`.

### Get My Donor Profile

```http
GET /donors/profile/me
Cookie: access_token=<HttpOnly cookie>
```

Access: Protected

Role: `donor`, `user`, or `admin`

Payload: none

### Update Donor Availability

```http
PATCH /donors/profile/availability
Cookie: access_token=<HttpOnly cookie>
```

Access: Protected

Role: `donor`, `user`, or `admin`

Payload:

```json
{
  "isAvailable": true
}
```

### Search Donors

```http
GET /donors/search
```

Access: Public

Payload: query params

Geo search example:

```http
GET /donors/search?bloodGroup=O%2B&lat=30.7333&lng=76.7794&radiusKm=10
```

Manual search example:

```http
GET /donors/search?bloodGroup=O%2B&state=Punjab&city=Chandigarh&district=Chandigarh
```

Required:
- `bloodGroup`

Optional:
- `lat`
- `lng`
- `radiusKm`
- `state`
- `city`
- `district`

Rules:
- `radiusKm` defaults to `50`.
- `radiusKm` must be between `1` and `50`.
- `lat` and `lng` must be supplied together.
- If no `lat/lng`, provide at least one location filter: `state`, `city`, or `district`.
- Search returns only MongoDB donor records.
- No phone numbers are returned in search results.
- Blocked users do not appear in search.

Response data shape:

```json
{
  "items": [
    {
      "id": "donorProfileId",
      "userId": "userId",
      "name": "Rahul Sharma",
      "profileImage": "https://example.com/profile.jpg",
      "bloodGroup": "O+",
      "state": "Punjab",
      "city": "Chandigarh",
      "district": "Chandigarh",
      "distanceKm": 2.4,
      "isAvailable": true,
      "isVerified": true,
      "lastDonationDate": "2025-12-01T00:00:00.000Z",
      "nextEligibleDate": "2026-03-01T00:00:00.000Z",
      "totalDonations": 0,
      "createdAt": "2026-05-05T00:00:00.000Z",
      "updatedAt": "2026-05-05T00:00:00.000Z"
    }
  ],
  "count": 1,
  "radiusKm": 10
}
```

### Get Public Donor Profile

```http
GET /donors/:id
```

Access: Public

Payload: none

Example:

```http
GET /donors/6638f2a2f1a2b3c4d5e6f789
```

Privacy:
- Does not return `phone`.
- Does not return `alternatePhone`.
- Does not return user `refreshToken`, OTP fields, or hidden provider fields.
- Used by frontend route `/donors/[id]`.

## Location APIs

### Get States

```http
GET /locations/states
```

Access: Public

Payload: none

Returns active states from the MongoDB `locations` collection.

### Get Districts

```http
GET /locations/districts?state=Punjab
```

Access: Public

Payload: query params

Required:
- `state`

### Get Cities

```http
GET /locations/cities?state=Punjab&district=Chandigarh
```

Access: Public

Payload: query params

Required:
- `state`

Optional:
- `district`

Notes:
- If `district` is omitted, cities for the whole state are returned.

### Create Location

```http
POST /locations
Cookie: access_token=<HttpOnly admin cookie>
```

Access: Protected

Role: `admin` only

Payload:

```json
{
  "country": "India",
  "state": "Punjab",
  "district": "Chandigarh",
  "city": "Chandigarh",
  "pincode": "160017",
  "lat": 30.7333,
  "lng": 76.7794,
  "isActive": true
}
```

Required:
- `state`
- `district`
- `city`

Optional:
- `country`
- `pincode`
- `lat`
- `lng`
- `isActive`

Notes:
- If `lat` is provided, `lng` is also required.
- If `lng` is provided, `lat` is also required.
- GeoJSON is stored as `[lng, lat]`.

### Bulk Create Locations

```http
POST /locations/bulk
Cookie: access_token=<HttpOnly admin cookie>
```

Access: Protected

Role: `admin` only

Payload:

```json
[
  {
    "country": "India",
    "state": "Punjab",
    "district": "Chandigarh",
    "city": "Chandigarh",
    "pincode": "160017",
    "lat": 30.7333,
    "lng": 76.7794,
    "isActive": true
  },
  {
    "country": "India",
    "state": "Punjab",
    "district": "SAS Nagar",
    "city": "Mohali",
    "pincode": "160055",
    "lat": 30.7046,
    "lng": 76.7179,
    "isActive": true
  }
]
```

Notes:
- Admin-only.
- Upserts records into the MongoDB `locations` collection.
- Frontend dropdowns must use these backend records, not static arrays.

### Search Locations

```http
GET /locations/search?keyword=Chandigarh
```

Access: Public

Payload: query params

Required:
- `keyword`

Searches active `state`, `district`, `city`, and `pincode` records in MongoDB.

### Reverse Geocode

```http
GET /locations/reverse-geocode?lat=30.7333&lng=76.7794
```

Access: Public

Payload: query params

Required:
- `lat`
- `lng`

Current behavior:
- Endpoint exists.
- Returns an error until a reverse-geocoding provider is configured.

## Collections Behind These APIs

These APIs must read/write MongoDB collections only:

- `users`
- `donorprofiles`
- `bloodrequests`
- `locations`
- `notifications`

Rules:
- No dummy donor list.
- No hardcoded donor search result.
- No frontend static location list.
- Search results must come from MongoDB donor profiles.
- Location dropdowns must come from MongoDB location records.
