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
- React Hook Form or Formik with `useFormik`
- Yup validation

### Backend 
- NestJS
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT authentication
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
JWT_SECRET=replace-with-secure-secret
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
- If PowerShell blocks `npm`, use `npm.cmd` instead.
