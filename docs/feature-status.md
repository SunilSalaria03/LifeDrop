# LifeDrop Feature Status

| Feature | Status | Notes |
| --- | --- | --- |
| Documentation structure | Complete | Initial AI-first docs created. |
| Backend project setup | Complete | NestJS project, ConfigModule, MongoDB connection, CORS, global prefix, response interceptor, and exception filter created. |
| Frontend project setup | Complete | Next.js project, Tailwind CSS, shadcn/ui-ready setup, Axios client, TanStack Query provider, and app layout created. |
| Landing page | In progress | Simplified public landing page with transparent GPS-only header location, OpenStreetMap reverse geocoding, manual hero blood group/state/city search using `country-state-city`, coordinate-based donor lookup payloads, modern donor result cards, loading skeletons, empty state, API error state, debounced lookup, action CTAs, and footer. |
| User authentication setup | In progress | Twilio phone OTP send/verify with 10-minute validity and resend timer, Google signup/login, refresh, logout, current-user endpoint, user roles, and auth guest-route protection implemented. Profile completion and full protected app routing remain future work. |
| User profile/onboarding | In progress | Protected backend user profile read/update API stores real profile and GeoJSON location data in `users`; frontend onboarding integration remains future work. |
| Donor profile creation | In progress | Protected backend APIs create, update, read own profile, and update availability using `donorprofiles`. |
| Blood request creation | Planned | Future MVP phase. |
| Nearby donor search | In progress | `GET /donors/search` uses MongoDB `$geoNear` when coordinates exist and DB filters otherwise. Donor cards link to the public `/donors/[id]` detail page backed by `GET /donors/:id`. No hardcoded donor/search data is allowed. |
| Donor eligibility logic | In progress | Donors are visible only when active, available, linked user is not blocked, and `nextEligibleDate` is due or missing. |
| Request lifecycle | Planned | Future MVP phase. |
| Notification-ready structure | Planned | Future MVP phase. |
| Admin-ready backend structure | In progress | Admin module folder created for future implementation, and `npm run seed:admin` creates or promotes the initial admin user in MongoDB. |
| Location management | In progress | `locations` collection and admin create/bulk APIs are implemented. Frontend header location uses automatic browser geolocation plus OpenStreetMap Nominatim, while hero state/city dropdowns use `country-state-city`; donor search remains backend DB-driven. |
