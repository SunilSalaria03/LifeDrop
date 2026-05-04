# LifeDrop Database Design

## Database
MongoDB Atlas with Mongoose.

## Current Schemas
### users

Supports LifeDrop authentication and profile readiness.

Fields:
- `name`: optional display name
- `email`: optional unique email for Google auth
- `phone`: optional unique E.164 phone number
- `profileImage`: optional profile image URL
- `authProvider`: `phone` or `google`
- `googleId`: hidden unique Google account id
- `isPhoneVerified`: boolean
- `isProfileCompleted`: boolean
- `isBlocked`: boolean
- `location`: optional GeoJSON point, stored only when valid coordinates exist
- `refreshToken`: hidden hashed refresh token
- `createdAt`: timestamp
- `updatedAt`: timestamp

Sensitive fields:
- `refreshToken` is selected out by default and never returned in user responses.
- `googleId` is selected out by default and never returned in user responses.

## Current Connection Setup
- Backend uses `MongooseModule.forRootAsync`.
- MongoDB URI is read from `MONGODB_URI`.
- Atlas connection details must be supplied through environment variables.

## Planned Collections
- `donors`
- `bloodrequests`
- `notifications`

## Current Indexes
- User email unique index
- User phone unique sparse index
- User Google id unique sparse index
- User blocked-status index
- User location sparse partial `2dsphere` index

## Planned Indexes
- Donor location geospatial index
- Donor blood group index
- Blood request status index
- Blood request location geospatial index
