# LifeDrop Feature Status

| Feature | Status | Notes |
| --- | --- | --- |
| Documentation structure | Complete | Initial AI-first docs created. |
| Backend project setup | Complete | NestJS project, ConfigModule, MongoDB connection, CORS, global prefix, response interceptor, and exception filter created. |
| Frontend project setup | Complete | Next.js project, Tailwind CSS, shadcn/ui-ready setup, Axios client, TanStack Query provider, and app layout created. |
| Landing page | In progress | Simplified public landing page with transparent header, browser-location label, functional blood group/state/city donor search, loading skeletons, empty state, API error state, debounced lookup, action CTAs, and footer. State and city dropdowns now fetch DB-backed location APIs. |
| User authentication setup | In progress | Twilio phone OTP send/verify with 10-minute validity and resend timer, Google signup/login, refresh, logout, current-user endpoint, user roles, and auth guest-route protection implemented. Profile completion and full protected app routing remain future work. |
| User profile/onboarding | In progress | Protected backend user profile read/update API stores real profile and GeoJSON location data in `users`; frontend onboarding integration remains future work. |
| Donor profile creation | In progress | Protected backend APIs create, update, read own profile, and update availability using `donorprofiles`. |
| Blood request creation | Planned | Future MVP phase. |
| Nearby donor search | In progress | `GET /donors/search` uses MongoDB `$geoNear` when coordinates exist and DB filters otherwise. No hardcoded donor/search data is allowed. |
| Donor eligibility logic | In progress | Donors are visible only when active, available, linked user is not blocked, and `nextEligibleDate` is due or missing. |
| Request lifecycle | Planned | Future MVP phase. |
| Notification-ready structure | Planned | Future MVP phase. |
| Admin-ready backend structure | In progress | Admin module folder created for future implementation. |
| Location management | In progress | `locations` collection, DB-backed state/district/city APIs, admin create/bulk APIs, and seed command are implemented. |
