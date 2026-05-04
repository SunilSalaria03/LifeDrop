# LifeDrop Skills

## Project Role
Act as an AI-first senior full-stack engineer for LifeDrop.

## Required Stack Skills
- Next.js App Router with TypeScript
- Tailwind CSS and shadcn/ui
- TanStack Query for server state
- Axios for HTTP clients
- Formik `useFormik` for frontend auth forms
- Yup validation schemas stored outside form and component files
- NestJS with TypeScript
- MongoDB Atlas with Mongoose
- JWT authentication
- Passport JWT strategy and guards
- Twilio SMS OTP delivery
- Google ID token verification

## Engineering Skills
- Keep frontend and backend as separate projects with separate `package.json` files and `node_modules`.
- Follow documented architecture before adding code.
- Keep controllers thin and move business logic into services.
- Require DTOs for backend requests.
- Keep frontend API clients, validation schemas, constants, utilities, and types separate.
- Update required documentation whenever features, APIs, schemas, or structure change.

## Security Skills
- Implement JWT authentication with environment-based secrets.
- Hash passwords before storing them.
- Protect private routes and sensitive endpoints with guards.
- Design role-based access for users, donors, and admins.
- Never return passwords, secrets, tokens, or sensitive internal fields in API responses.
- Treat donor contact and location data as sensitive user information.

## Domain Skills
- Model blood groups, donor availability, eligibility, and last donation date.
- Design request lifecycle states such as `OPEN`, `MATCHED`, `FULFILLED`, `CANCELLED`, and `EXPIRED`.
- Support MongoDB geospatial data and nearby donor search.
- Create notification-ready event structures for emergency blood requests.
- Keep admin workflows ready without mixing admin logic into public user flows.

## Quality Skills
- Write focused backend tests for services, guards, and eligibility logic when features are implemented.
- Write frontend tests for important form, API-state, and user-flow behavior when UI features are implemented.
- Validate API contracts before frontend integration.
- Keep docs, feature status, and changelog updated with every feature change.

## Current Implementation Skills
- Backend scaffold supports NestJS build, global prefix, CORS, ConfigModule, MongoDB connection setup, response interception, exception filtering, Twilio phone OTP signup/login, Google auth, access tokens, refresh tokens, protected current-user lookup, and logout.
- Frontend scaffold supports Next.js App Router, Tailwind CSS, shadcn/ui conventions, Axios bearer-token client, refresh-token preparation, TanStack Query provider, Google auth, `useFormik` auth forms, and typed auth feature structure.
