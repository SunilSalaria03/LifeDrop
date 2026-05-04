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
- User profile onboarding
- Donor profile creation and update
- Blood request creation and lifecycle updates
- Nearby donor search
- Notification-ready emergency events
- Admin-ready management endpoints
