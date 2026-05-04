# LifeDrop Rules

## Documentation Rules
Before implementation, create and maintain project documentation in `/docs`.

Whenever adding, updating, or removing a feature:
- Update `skills.md`.
- Update `architecture.md` if structure changes.
- Update `api-contracts.md` if API changes.
- Update `database-design.md` if schema changes.
- Update `feature-status.md`.
- Update `changelog.md`.

## Backend Rules
- Controllers only handle request and response.
- Services contain business logic.
- DTOs are required for every request body/query/param contract.
- Use `class-validator` for DTO validation.
- Use a response interceptor.
- Use a global exception filter.
- Use `ConfigModule`.
- Use Mongoose schemas.
- Add indexes where needed.
- Never expose sensitive fields.
- Passwords must be hashed before storage.
- JWT secrets, database URLs, and third-party credentials must come from environment variables.
- Protected endpoints must use guards.
- Admin endpoints must be role-protected.
- List endpoints must define pagination, filtering, and sorting behavior before implementation.
- API responses must follow the standard response interceptor format unless streaming or file download requires a documented exception.
- Backend modules must not reach across module boundaries directly; use services and exports.

## Database Rules
- Define schema fields, indexes, and sensitive-field behavior before adding collections.
- Add geospatial indexes for donor and request location queries.
- Store coordinates in a consistent longitude-latitude order for MongoDB geospatial queries.
- Do not expose exact donor location unless the feature explicitly requires it and access is authorized.
- Track timestamps for user-facing and lifecycle-driven collections.

## Frontend Rules
- Use reusable components.
- Use shadcn/ui.
- Use TanStack Query for API state.
- Keep API calls in `lib/api` or feature API files.
- Keep validation schemas in `lib/validations`.
- Keep interfaces and types separate.
- Use clean responsive UI.
- Do not hardcode API URLs; use environment variables.
- Do not place Yup schemas inside page, form, or component files.
- Protected frontend routes must check authenticated state.
- API errors must be shown through reusable UI patterns.
- Loading, empty, and error states are required for server-state screens.
- Keep donor/requester emergency flows fast, clear, and mobile-friendly.

## Testing Rules
- A feature cannot be marked complete until its main success and failure paths are tested or the missing test reason is documented.
- Backend business logic should be tested at the service level.
- Frontend API-state and form-heavy flows should have focused tests once features are implemented.
- Build or type-check both projects before handoff when practical.

## Environment Rules
- Keep real `.env` files out of Git.
- Maintain `.env.example` files when environment variables change.
- Do not hardcode local, staging, or production API URLs in source code.
- Log files, build outputs, dependency folders, and generated caches must stay ignored.
