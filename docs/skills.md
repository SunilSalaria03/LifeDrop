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
- Landing donor search with TanStack Query, Axios, reusable filters, automatic frontend GPS header location, manual `country-state-city` hero state/city dropdowns that submit selected city coordinates, debounced requests, modern donor cards, donor detail routing, loading skeletons, empty states, and API error states
- Profile setup and donor onboarding flows with Google-user phone verification, phone-user profile completion, redirect-aware login, and protected donor profile creation
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
- Provide manual and browser-location-assisted search paths without exposing exact donor locations.
- Keep donor search, donor profiles, and user location fields database-driven through MongoDB collections. Header location detection uses frontend geolocation and OpenStreetMap Nominatim; hero state/city dropdowns use `country-state-city`.
- Store GeoJSON coordinates in `[lng, lat]` order for users, donor profiles, locations, and blood requests.
- Create notification-ready event structures for emergency blood requests.
- Keep admin workflows ready without mixing admin logic into public user flows.

## Quality Skills
- Write focused backend tests for services, guards, and eligibility logic when features are implemented.
- Write frontend tests for important form, API-state, and user-flow behavior when UI features are implemented.
- Validate API contracts before frontend integration.
- Keep docs, feature status, and changelog updated with every feature change.
- Check auth flows end to end after every auth change: send OTP, verify OTP, Google login, refresh token, logout, route redirects, and blocked-user handling.
- Keep Google login, phone OTP login, profile setup, and become-donor redirects aligned: incomplete profiles go to `/profile/setup`, donor CTA guests go through login with a redirect, and donor creation waits for completed profiles.
- Verify optional Mongoose subdocuments do not create invalid partial values that break indexes.
- Keep Twilio OTP validity, resend cooldown, failed-attempt limits, and provider max-attempt errors explicit in code and docs.

## Prevent Known Regressions
- Do not issue phone-auth tokens from OTP send; issue tokens only after OTP verification succeeds.
- Do not allow `/auth/refresh` to trigger another refresh attempt from Axios interceptors.
- Do not expose `refreshToken`, `googleId`, OTP fields, or exact donor location in safe user responses.
- Do not expose donor `phone` or `alternatePhone` in donor search or public donor profile responses.
- Do not reintroduce hardcoded donors, hardcoded states, or hardcoded city/district dropdown data; use MongoDB-backed APIs.
- Do not use Firebase phone verification unless architecture/docs are intentionally changed back from Twilio.
- Do not add email/password login unless product scope and docs explicitly change.
- Do not define duplicate Mongoose indexes through both `@Prop` options and `Schema.index`.

## Current Implementation Skills
- Backend scaffold supports NestJS build, Swagger at `/api/v1/docs`, global prefix, CORS, ConfigModule, MongoDB connection setup, response interception, exception filtering, Twilio phone OTP signup/login with validity/cooldown tracking, Google auth, access tokens, refresh tokens, role-aware users, protected current-user lookup, and logout.
- Backend donor and location APIs are database-driven with `users`, `donorprofiles`, `bloodrequests`, `locations`, and `notifications` collections.
- Backend profile and donor APIs require JWT ownership, block blocked users, and prevent donor profile creation until the user's profile is complete.
- Frontend scaffold supports Next.js App Router, Tailwind CSS, shadcn/ui conventions, Axios bearer-token client, refresh-token preparation, TanStack Query provider, Google auth, `useFormik` auth forms, and typed auth feature structure.
- Frontend includes `/profile/setup` for required profile completion and `/become-donor` for protected real donor profile submission.
- Landing page supports automatic header location detection with browser geolocation, OpenStreetMap Nominatim reverse geocoding, manual hero state/city dropdowns from `country-state-city`, debounced donor search through the shared Axios client, modern donor result cards, public donor detail links, and clear loading, empty, and API failure states.
