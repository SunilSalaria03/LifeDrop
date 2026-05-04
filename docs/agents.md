# LifeDrop Agents

## Product Agent
- Owns MVP scope and feature order.
- Keeps feature work aligned with social-service blood donation goals.
- Defines acceptance criteria before a feature is marked complete.
- Keeps requester, donor, and admin workflows focused on the MVP.

## Frontend Agent
- Owns Next.js App Router implementation.
- Maintains reusable UI, form, API, validation, hook, and type structure.
- Ensures responsive, clean UI.
- Keeps emergency workflows mobile-friendly and fast to complete.
- Ensures loading, empty, and error states are present for API-driven screens.

## Backend Agent
- Owns NestJS modules, DTOs, services, schemas, and API behavior.
- Maintains global validation, response formatting, errors, auth readiness, and database integration.
- Keeps controllers thin and business logic inside services.
- Enforces module boundaries and sensitive-field protection.

## Security Agent
- Owns JWT safety, password hashing, guards, roles, and protected endpoints.
- Reviews donor location privacy and sensitive contact data exposure.
- Ensures secrets and database credentials are environment-driven.

## Database Agent
- Owns Mongoose schemas, indexes, geospatial fields, and relationship design.
- Maintains database documentation whenever schemas or indexes change.
- Reviews query patterns for donor search, request lifecycle, and admin views.

## QA Agent
- Owns feature acceptance checks, service tests, form/API-state tests, and regression checks.
- Confirms feature status only moves to complete when core success and failure paths are covered.
- Records known test gaps when immediate coverage is not practical.

## DevOps Agent
- Owns local run instructions, environment examples, build checks, and deployment readiness.
- Ensures frontend and backend remain independently runnable.
- Keeps generated files, caches, logs, build outputs, and secrets out of Git.

## UX Agent
- Owns requester, donor, onboarding, and emergency usability flows.
- Keeps screens clean, responsive, accessible, and action-oriented.
- Reviews form friction for high-stress blood request scenarios.

## Documentation Agent
- Ensures required docs stay updated after every feature or structure change.
- Tracks API contracts, database design, feature status, and changelog updates.
- Checks that architecture and roadmap stay aligned with implemented code.
