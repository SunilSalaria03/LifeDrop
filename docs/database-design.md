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
- `role`: `user`, `donor`, or `admin`, defaults to `user`
- `googleId`: hidden unique Google account id
- `isPhoneVerified`: boolean
- `isProfileCompleted`: boolean
- `isBlocked`: boolean
- `addressText`: optional user address text
- `state`: optional state from DB-backed location data
- `city`: optional city from DB-backed location data
- `district`: optional district from DB-backed location data
- `location`: optional GeoJSON point, stored only when valid coordinates exist
- `refreshToken`: hidden hashed refresh token
- `otpHash`: hidden hashed OTP for local/development SMS fallback
- `otpValidUntil`: hidden OTP expiry timestamp
- `otpLastSentAt`: hidden resend cooldown timestamp
- `otpFailedAttempts`: hidden failed OTP attempt counter
- `createdAt`: timestamp
- `updatedAt`: timestamp

Sensitive fields:
- `refreshToken` is selected out by default and never returned in user responses.
- `googleId` is selected out by default and never returned in user responses.
- OTP fields are selected out by default and never returned in user responses.

Profile completion rule:
- `isProfileCompleted` is true only when the user has `name`, `phone`, `isPhoneVerified`, `state`, and `city`.

### donorprofiles

Stores one donor profile per user.

Fields:
- `userId`: required unique reference to `users`
- `bloodGroup`: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, or `O-`
- `phone`: donor contact phone, hidden from search results
- `alternatePhone`: optional donor contact phone, hidden from search results
- `state`, `city`, `district`, `addressText`: donor location text from DB-backed location choices
- `location`: required MongoDB GeoJSON point with coordinates stored as `[lng, lat]`
- `lastDonationDate`: optional last donation date
- `nextEligibleDate`: optional eligibility date, calculated as last donation date plus 90 days
- `isAvailable`, `isActive`, `isVerified`: donor visibility and moderation flags
- `totalDonations`: donation count
- `createdAt`, `updatedAt`: timestamps

Indexes:
- unique `userId`
- `location` 2dsphere
- `bloodGroup`, `state`, `city`, `district`, `isAvailable`, `isActive`, `isVerified`

Creation rule:
- Donor profiles can be created or updated only by the owning logged-in user after their user profile is complete and the account is not blocked.

### locations

Stores location dropdown and search data. Frontend state, district, and city dropdowns must fetch this collection through backend APIs.

Fields:
- `country`
- `state`
- `district`
- `city`
- `pincode`
- `location`: optional GeoJSON point with `[lng, lat]`
- `isActive`
- `createdAt`, `updatedAt`

Indexes:
- `state`, `district`, `city`, `pincode`
- `location` sparse partial 2dsphere
- unique compound `country + state + district + city + pincode`

### bloodrequests

Stores requester-owned blood request records with GeoJSON request location.

Indexes:
- `location` 2dsphere
- `bloodGroup`, `status`, `state`, `city`, `expiresAt`

### notifications

Stores notification-ready event records for future SMS, email, push, and in-app delivery boundaries.

Indexes:
- `userId`, `bloodRequestId`, `channel`, `status`, `createdAt`

## Current Connection Setup
- Backend uses `MongooseModule.forRootAsync`.
- MongoDB URI is read from `MONGODB_URI`.
- Atlas connection details must be supplied through environment variables.

## Current Collections
- `users`
- `donorprofiles`
- `bloodrequests`
- `locations`
- `notifications`

## Current Indexes
- User email unique index
- User phone unique sparse index
- User Google id unique sparse index
- User blocked-status index
- User role index
- User location sparse partial `2dsphere` index
- Donor profile geospatial, blood group, location text, and visibility indexes
- Location text, pincode, unique compound, and optional geospatial indexes
- Blood request status, blood group, city/state, expiry, and geospatial indexes
- Notification ownership, request, channel, status, and created-date indexes
