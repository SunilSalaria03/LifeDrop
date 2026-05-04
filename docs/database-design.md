# LifeDrop Database Design

## Database
MongoDB Atlas with Mongoose.

## Current Schemas
No schemas are implemented yet.

## Current Connection Setup
- Backend uses `MongooseModule.forRootAsync`.
- MongoDB URI is read from `MONGODB_URI`.
- Atlas connection details must be supplied through environment variables.

## Planned Collections
- `users`
- `donors`
- `bloodrequests`
- `notifications`

## Planned Indexes
- User email unique index
- Donor location geospatial index
- Donor blood group index
- Blood request status index
- Blood request location geospatial index
