# LifeDrop

LifeDrop is a location-based blood donation platform that connects donors with people in need, making it easier to save lives in real time.

## Tech Stack

### Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Axios
- Formik with `useFormik`
- Yup validation
- Google Identity Services

### Backend 
- NestJS
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT authentication
- Passport JWT
- Twilio SMS OTP
- Firebase Admin for optional Firebase Google token fallback
- Google ID token verification
- class-validator

## Project Structure

```text
LifeDrop/
  docs/
  backend/
  frontend/
```

The frontend and backend run as separate projects. Each project has its own `package.json`, `package-lock.json`, and `node_modules`.

## Backend Local Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
copy .env.example .env
```

Update `backend/.env` with your real values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lifedrop
JWT_ACCESS_SECRET=replace-with-secure-access-secret
JWT_REFRESH_SECRET=replace-with-secure-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@example.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nreplace-with-private-key\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+10000000000
TWILIO_VERIFY_SERVICE_SID=your-twilio-verify-service-sid
FRONTEND_ORIGIN=http://localhost:3000
```

Run backend in development mode:

```bash
npm run start:dev
```

Backend API base URL:

```text
http://localhost:5000/api/v1
```

Health check:

```text
GET http://localhost:5000/api/v1/auth/health
```

Build backend:

```bash
npm run build
```

Start built backend:

```bash
npm run start
```

## Frontend Local Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
copy .env.example .env.local
```

Update `frontend/.env.local` if needed:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

Run frontend in development mode:

```bash
npm run dev
```

Frontend local URL:

```text
http://localhost:3000
```

Build frontend:

```bash
npm run build
```

Start built frontend:

```bash
npm run start
```

## Useful Commands

Backend:

```bash
cd backend
npm run start:dev
npm run build
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
```

## Notes

- Keep real `.env` files out of Git.
- Backend must have a valid `MONGODB_URI` before it can connect to MongoDB Atlas.
- Frontend reads the backend URL from `NEXT_PUBLIC_API_BASE_URL`.
- Phone OTP sends SMS through Twilio from the backend.
- Google auth requires `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in the frontend and `GOOGLE_CLIENT_ID` in the backend.
- If PowerShell blocks `npm`, use `npm.cmd` instead.
