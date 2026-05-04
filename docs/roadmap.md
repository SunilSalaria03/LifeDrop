# LifeDrop Roadmap

## Phase 1: Foundation
- Create documentation structure.
- Scaffold separate backend and frontend projects.
- Configure backend environment, MongoDB connection, CORS, global API prefix, response interceptor, exception filter, and auth skeleton.
- Configure frontend Tailwind CSS, shadcn/ui-ready structure, Axios client, TanStack Query provider, and app layout.
- Confirm `.env.example` files are complete.
- Keep generated logs, caches, build output, and secrets ignored.

## Phase 2: Security And Data Design
- Define user, donor, blood request, notification, and admin data models.
- Define sensitive fields and safe response shapes.
- Define geospatial location format and indexes.
- Define role model for user, donor, and admin access.
- Define request lifecycle states and transitions.

## Phase 3: API Contracts
- Design auth API contracts.
- Design user onboarding API contracts.
- Design donor profile and nearby search API contracts.
- Design blood request lifecycle API contracts.
- Design notification-ready event contracts.
- Design admin-ready API boundaries.

## Phase 4: Authentication
- User registration.
- User login.
- JWT access token flow.
- Authenticated current-user endpoint.
- Password hashing.
- Auth guards and protected route foundations.

## Phase 5: User Onboarding
- User profile setup.
- Blood group, location, and contact preferences.
- Frontend onboarding flow.
- Validation schemas outside UI files.
- Authenticated profile API integration.

## Phase 6: Donor Features
- Donor profile creation.
- Donor eligibility logic.
- Nearby donor search.
- Donor availability management.
- Geospatial donor search with radius limits.
- Donor privacy-safe response format.

## Phase 7: Blood Requests
- Blood request creation.
- Request lifecycle management.
- Emergency notification-ready event structure.
- Request owner permissions.
- Request status transitions.
- Request search/filter foundations.

## Phase 8: Notification Readiness
- Store notification-ready events.
- Prepare provider boundary for future SMS, email, or push.
- Ensure notification failures do not break request creation.

## Phase 9: Admin Readiness
- Admin module structure.
- Admin-safe user, donor, and request management foundations.
- Role-protected admin endpoints.
- Admin dashboard route foundations.

## Phase 10: QA And Deployment Readiness
- Add focused tests for core backend services.
- Add frontend checks for important forms and API states.
- Verify backend build and frontend type-check/build where local environment allows.
- Document deployment environment variables.
- Prepare MVP acceptance checklist.

## MVP Acceptance Checklist
- Users can register, login, and load their authenticated profile.
- Users can complete onboarding with blood group, contact preference, and location.
- Users can create and manage their donor profile.
- Users can create a blood request and move it through documented lifecycle states.
- Users can search nearby eligible donors safely.
- Emergency request flow creates notification-ready events.
- Admin structure is role-protected and ready for management features.
- API contracts, database design, feature status, and changelog are current.
