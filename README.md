# LifeDrop

LifeDrop is a blood donation platform that helps people search nearby donors, request blood, and register as donors through a real MongoDB-backed system.

## Repository

```bash
git clone https://github.com/SunilSalaria03/LifeDrop.git
cd LifeDrop
```

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Radix UI
- TanStack Query
- Axios
- Formik with `useFormik`
- Yup validation
- Lucide React icons
- `country-state-city` for India state/city dropdowns
- OpenStreetMap Nominatim for browser-location reverse geocoding
- Google Identity Services

### Backend

- NestJS
- TypeScript
- MongoDB Atlas or local MongoDB
- Mongoose
- MongoDB GeoJSON and `$geoNear`
- JWT authentication
- Passport JWT
- Twilio SMS OTP
- Google ID token verification
- Firebase Admin fallback for Firebase Google tokens
- Swagger API docs
- class-validator and class-transformer

## Project Structure

```text
LifeDrop/
  backend/
  frontend/
  docs/
```

The backend and frontend are separate projects. Run install commands inside each folder.

## Environment Files

Use `.env.example` as the template and create `.env` in each app.

```bash
cd backend
copy .env.example .env

cd ../frontend
copy .env.example .env
```

Do not commit real `.env` values.

## Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Update `backend/.env` with your local values. Important values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lifedrop
JWT_ACCESS_SECRET=replace-with-secure-access-secret
JWT_REFRESH_SECRET=replace-with-secure-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_ORIGIN=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+10000000000
TWILIO_WHATSAPP_NUMBER=+14155238886
TWILIO_VERIFY_SERVICE_SID=your-twilio-verify-service-sid
```

Run backend:

```bash
npm run start:dev
```

Backend URL:

```text
http://localhost:5000/api/v1
```

Swagger docs:

```text
http://localhost:5000/api/v1/docs
```

Health check:

```text
GET http://localhost:5000/api/v1/auth/health
```

Useful backend commands:

```bash
npm run build
npm run seed:admin
npm run start
```

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Update `frontend/.env`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Run frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

Useful frontend commands:

```bash
npm run build
npm run start
```

## Run Both Apps Locally

Terminal 1:

```bash
cd backend
npm run start:dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

## MongoDB Compass Setup

1. Open `backend/.env`.
2. Copy the value of `MONGODB_URI`.
3. Open MongoDB Compass.
4. Click `Add new connection`.
5. Paste the copied MongoDB connection string.
6. Save the connection.
7. Click `Connect`.

After backend APIs create data, you should see collections such as:

- `users`
- `donorprofiles`
- `bloodrequests`
- `notifications`

## Main Features

- Phone OTP login/signup
- Google login/signup
- Profile setup after login
- Google users verify phone before profile completion
- Become donor flow with protected donor form
- Donor profiles stored in MongoDB
- Nearby donor search using GeoJSON and `$geoNear`
- Header GPS location detection through browser geolocation and Nominatim
- Manual hero search with blood group, state, and city
- Public donor cards and donor detail page

## Notes

- Backend must run before frontend API calls work.
- Keep `backend/.env` and `frontend/.env` private.
- If PowerShell blocks `npm`, use `npm.cmd` instead.
- For local development without real Twilio Verify, check backend OTP development behavior in the auth service and environment values.
