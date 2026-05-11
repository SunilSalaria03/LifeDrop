# LifeDrop Architecture

## Overview
LifeDrop is an MVP social-service blood donation platform. It allows users to request blood, become donors, search nearby donors, and receive emergency notification-ready flows.

## Repository Layout
```text
LifeDrop/
  docs/
  backend/
  frontend/
```

The backend and frontend run separately and maintain separate dependencies.

## Runtime Projects
- `backend` is a standalone NestJS project with its own `package.json`, `package-lock.json`, and `node_modules`.
- `frontend` is a standalone Next.js project with its own `package.json`, `package-lock.json`, and `node_modules`.
- Environment examples live in `backend/.env.example` and `frontend/.env.example`.
- Real environment files must stay local and ignored by Git.

## Backend Architecture
```text
backend/
  src/
    main.ts
    app.module.ts
    config/
    common/
      decorators/
      guards/
      filters/
      interceptors/
      pipes/
      helpers/
      constants/
    modules/
      auth/
      users/
      donors/
      blood-requests/
      notifications/
      admin/
      locations/
```

Backend responsibilities:
- Expose REST APIs under `/api/v1`.
- Use NestJS modules by feature.
- Use MongoDB through Mongoose.
- Apply global validation, response formatting, and exception handling.
- Keep authentication JWT-ready.
- Use guards for protected and role-based endpoints.
- Keep sensitive fields out of serialized responses.

Implemented foundation:
- `main.ts` configures `/api/v1`, CORS, validation pipe, response interceptor, and global exception filter.
- `app.module.ts` configures global environment variables and MongoDB through `MongooseModule`.
- `modules/auth` contains OTP send/verify, Google auth, token refresh, logout, current-user auth, JWT guard, and JWT strategy.
- `modules/users` contains the Mongoose user schema, profile read/update APIs, and user persistence service used by auth.
- `modules/donors` contains donor profile creation, updates, availability, public profile details, and DB-backed donor search.
- `modules/locations` contains DB-backed state, district, city, location search, and admin location create APIs.
- `modules/blood-requests` and `modules/notifications` contain persistence schemas and indexes for request and notification collections.

## Backend Module Responsibilities
- `auth`: registration, login, JWT issuing, current-user auth flow, phone/Google verification, and auth guards.
- `users`: user profile, onboarding data, contact preferences, and safe public user views.
- `donors`: donor profile, blood group, availability, last donation date, eligibility, and donor location.
- `blood-requests`: request creation, request lifecycle, urgency, blood group need, hospital/contact details, and requester ownership.
- `notifications`: notification-ready event records and future SMS/email/push integration boundaries.
- `admin`: role-protected operational views and moderation-ready workflows.
- `locations`: DB-backed state/city/district records, geospatial location records, and reusable location validation.

## Auth And Access Flow
- Public users can signup/login using phone OTP or Google only.
- Email/password login is not part of the MVP auth architecture.
- Phone signup/login starts on the frontend with a phone number. The backend creates or finds a minimal phone user, sends OTP through Twilio, and the frontend routes to OTP verification. Tokens are returned only after OTP verification succeeds.
- Phone OTP remains valid for 10 minutes and resend is throttled to one request every 60 seconds.
- User roles are `user`, `donor`, and `admin`; new auth users start as `user`.
- Google signup/login starts on the frontend through Google Identity Services using `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and is verified on the backend with `GOOGLE_CLIENT_ID`. The backend also supports Firebase Google sign-in tokens.
- Google users without `phoneVerified` are sent to `/profile/setup` to add and verify a phone number with OTP.
- Normal users are not required to complete donor-style profile details; donor details are collected only when they become donors.
- Successful auth sets `access_token` and `refresh_token` as HttpOnly cookies and returns only the safe user object.
- Access tokens expire after 15 minutes and refresh tokens expire after 7 days.
- Access tokens protect `/auth/me` and future private endpoints through Passport JWT by reading the HttpOnly cookie.
- Refresh uses the `refresh_token` cookie, rotates the stored refresh-token hash, and sets a new cookie pair.
- Logout clears both auth cookies and removes the active refresh-token hash when a refresh cookie is available.
- Refresh tokens are hashed before storing in the user document and are never exposed in user responses.
- Blocked users cannot login or refresh tokens.
- Authenticated users can manage their own profile, donor profile, and blood requests.
- Donor search must reveal only approved and safe donor information.
- Admin routes must require an admin role.
- JWT payloads should contain only stable identifiers and role claims needed for authorization.

## Data Ownership
- A user owns one primary user profile.
- A user may optionally create one donor profile.
- A user may create many blood requests.
- Blood requests track their requester and lifecycle status.
- Notification events are linked to the triggering request and target audience.

## Request Lifecycle
Blood request lifecycle states:
- `OPEN`: request is active and visible for matching.
- `MATCHED`: one or more donors are identified or contacted.
- `FULFILLED`: request has been completed.
- `CANCELLED`: requester or admin cancelled the request.
- `EXPIRED`: request is no longer active after its time window.

Lifecycle changes must be handled in services and recorded in API contracts when implemented.

## Location And Nearby Search
- Store donor and request locations as MongoDB GeoJSON points.
- Use `2dsphere` indexes for nearby donor and request search.
- Store GeoJSON coordinates in `[lng, lat]` order everywhere.
- Donor search is fully database-driven from the `donorprofiles` collection and joined `users` collection.
- Manual donor search filters real donor profiles by state, city, and district from MongoDB.
- Header location selection uses automatic frontend browser geolocation and OpenStreetMap Nominatim reverse geocoding.
- Keep exact donor location private unless explicitly authorized by a feature.
- Search APIs should accept distance/radius inputs with documented limits.

## Notification-Ready Architecture
- Notification logic starts as internal event records before real provider integration.
- Emergency request creation should be able to emit a notification-ready event.
- Notification delivery providers must stay behind service boundaries.
- Notification failures should not corrupt blood request creation.

## Frontend Architecture
```text
frontend/
  src/
    app/
      auth/
      onboarding/
      dashboard/
      donors/
      request-blood/
      admin/
    components/
      ui/
      common/
      forms/
      landing/
      layout/
    features/
      auth/
      users/
      donors/
      blood-requests/
    lib/
      api/
      validations/
      constants/
      utils/
    hooks/
    types/
```

Frontend responsibilities:
- Render the LifeDrop application with Next.js App Router.
- Use Tailwind CSS and shadcn/ui for UI foundations.
- Use TanStack Query for server state.
- Use Axios clients configured from environment variables.
- Keep validation, types, and API access outside UI components.
- Keep protected page logic separate from presentational UI.
- Provide loading, empty, and error states for data-driven screens.

Implemented foundation:
- `components/layout/query-provider.tsx` provides TanStack Query.
- `lib/api/client.ts` provides an Axios client using `NEXT_PUBLIC_API_BASE_URL`.
- `components.json`, `components/ui/button.tsx`, and `lib/utils` provide shadcn/ui-ready structure.

## Frontend Feature Boundaries
- `app` contains routes and route layouts.
- `features` contains feature-specific API hooks, components, and state helpers when needed.
- `components` contains reusable UI, layout, common, and form components.
- `components/landing` contains reusable landing-page sections for the home page.
- `lib/api` contains shared API clients and low-level request helpers.
- `lib/validations` contains Yup schemas only.
- `types` contains shared TypeScript interfaces and API models.

## Frontend Auth Flow
- `/auth/login` accepts phone numbers, calls the backend Twilio OTP send flow, and routes to `/auth/otp`.
- `/auth/otp` verifies OTP with the backend, shows a resend timer, stores returned tokens, and redirects to `/profile/setup` when `phoneVerified` is false.
- Auth guest pages redirect already logged-in users to `/profile/setup`, the requested redirect target, or dashboard depending on profile state.
- `/profile/setup` is protected by a frontend auth guard and redirects unauthenticated users to login.
- `/become-donor` redirects guests to login, redirects unverified users to `/profile/setup?redirect=/become-donor`, and shows a single protected donor form once `phoneVerified` is true. The form collects basic profile, contact, and donor details in one submit, then promotes the account to donor.
- `/auth/google` provides a focused Google auth entry point using Google Identity Services.
- `/profile/setup` is the redirect target when phone verification is required.
- Auth mutations live in `features/auth/hooks/useAuth.ts`.
- Auth API calls live in `features/auth/api/auth.api.ts`.
- Auth validation lives in `features/auth/validations/auth.validation.ts`.
- Auth types live in `features/auth/types/auth.types.ts`.
- Axios sends credentials for cookie auth, refreshes expired access cookies once, and avoids recursive refresh calls on `/auth/refresh`.
- Frontend auth state stores only the current safe user in memory and restores sessions through `/auth/me`.

## Frontend Landing Page
- `/` renders the public LifeDrop landing page.
- `/donors/[id]` renders a public privacy-safe donor profile detail page from `GET /donors/:id`.
- Landing sections live under `components/landing`.
- The simplified current landing page includes a transparent sticky header, functional hero donor search, action cards, and footer.
- The header includes automatic browser geolocation detection with persisted localStorage selection.
- The hero search uses reusable blood group selection and saved GPS coordinates, then calls donor search through TanStack Query and the shared Axios client.
- Donor search targets `GET /api/v1/donors/search` and renders only backend database records.
- Landing CTA buttons route to `/request-blood` and `/become-donor`; the hero `Find Blood` action routes to `/request-blood` with selected search query values.

## Deployment Shape
- Frontend and backend deploy independently.
- Frontend reads the backend base URL from `NEXT_PUBLIC_API_BASE_URL`.
- Backend reads MongoDB, JWT, CORS, and port configuration from environment variables.
- Production deployment must configure allowed origins and secure secrets before public release.
