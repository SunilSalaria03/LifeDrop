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
- Role-aware user modeling for `user`, `donor`, and `admin`

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
- Prevent auth refresh loops by excluding refresh endpoints from automatic retry logic.
- Protect guest-only routes from logged-in users and protected routes from anonymous users.
- Convert third-party provider failures into clean HTTP errors without blocking unrelated APIs.

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
- Check auth flows end to end after every auth change: send OTP, verify OTP, Google login, refresh token, logout, route redirects, and blocked-user handling.
- Verify optional Mongoose subdocuments do not create invalid partial values that break indexes.
- Keep Twilio OTP validity, resend cooldown, failed-attempt limits, and provider max-attempt errors explicit in code and docs.

## Prevent Known Regressions
- Do not issue phone-auth tokens from OTP send; issue tokens only after OTP verification succeeds.
- Do not allow `/auth/refresh` to trigger another refresh attempt from Axios interceptors.
- Do not expose `refreshToken`, `googleId`, OTP fields, or exact donor location in safe user responses.
- Do not use Firebase phone verification unless architecture/docs are intentionally changed back from Twilio.
- Do not add email/password login unless product scope and docs explicitly change.
- Do not define duplicate Mongoose indexes through both `@Prop` options and `Schema.index`.

## Current Implementation Skills
- Backend scaffold supports NestJS build, global prefix, CORS, ConfigModule, MongoDB connection setup, response interception, exception filtering, Twilio phone OTP signup/login with validity/cooldown tracking, Google auth, access tokens, refresh tokens, role-aware users, protected current-user lookup, and logout.
- Frontend scaffold supports Next.js App Router, Tailwind CSS, shadcn/ui conventions, Axios bearer-token client, refresh-token preparation, TanStack Query provider, Google auth, `useFormik` auth forms, and typed auth feature structure.
