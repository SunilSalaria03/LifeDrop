# LifeDrop Feature Status

| Feature | Status | Notes |
| --- | --- | --- |
| Documentation structure | Complete | Initial AI-first docs created. |
| Backend project setup | Complete | NestJS project, ConfigModule, MongoDB connection, CORS, global prefix, response interceptor, and exception filter created. |
| Frontend project setup | Complete | Next.js project, Tailwind CSS, shadcn/ui-ready setup, Axios client, TanStack Query provider, and app layout created. |
| Landing page | In progress | Public landing page with transparent GPS-only header location, OpenStreetMap reverse geocoding, manual hero blood group/state/city search using `country-state-city`, coordinate-based donor lookup payloads, modern donor result cards, static impact metric cards, how-it-works steps, success story carousel, final community CTA, loading skeletons, empty state, API error state, action CTAs, and footer. |
| User authentication setup | In progress | Twilio phone OTP send/verify with 10-minute validity and resend timer, Google signup/login, HttpOnly cookie access/refresh tokens, refresh rotation, logout cookie clearing, current-user endpoint, user roles, auth guest-route protection, redirect-aware login, and polished login card UI implemented. |
| User profile/setup | In progress | `/profile/setup` is implemented. Google users must verify phone OTP before completing profile, phone users fill required profile fields directly, and completion requires name, verified phone, state, and city. Authenticated profile reads now include `donorProfile` for donor users so `/profile` can render user and donor data from one read source. |
| Donor profile creation | In progress | `/become-donor` requires login and completed profile, then saves one real donor profile per user in `donorprofiles`. Protected backend APIs create, update, read own profile, and update availability. |
| Blood request creation | Planned | Future MVP phase. |
| Nearby donor search | In progress | `GET /donors/search` uses MongoDB `$geoNear` when coordinates exist and DB filters otherwise. Donor cards link to the public `/donors/[id]` detail page backed by `GET /donors/:id`. No hardcoded donor/search data is allowed. |
| Donor eligibility logic | In progress | Donors are visible only when active, available, linked user is not blocked, and `nextEligibleDate` is due or missing. |
| Request lifecycle | Planned | Future MVP phase. |
| Notification-ready structure | Planned | Future MVP phase. |
| Admin-ready backend structure | In progress | Admin module folder created for future implementation, and `npm run seed:admin` creates or promotes the initial admin user in MongoDB. |
| Location management | In progress | `locations` collection and admin create/bulk APIs are implemented. Frontend header location uses automatic browser geolocation plus OpenStreetMap Nominatim, while hero state/city dropdowns use `country-state-city`; donor search remains backend DB-driven. |
