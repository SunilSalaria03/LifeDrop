Setup Front-end and Back-end Prompts


You are an AI-first senior full-stack engineer.


Project Name: LifeDrop


Goal:
Build an MVP social-service blood donation platform where users can request blood, join as donors, search nearby donors, and receive emergency notifications.


Tech Stack:
Frontend:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Axios
- React Hook Form or Formik with useFormik only
- Yup validation(not will be in form or components files , its will be in seprate dir.)


Backend:
- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT Auth 


Database:
- MongoDB Atlas
- Mongoose 

 


Important:
Before generating code, create this AI-first development structure:


/docs
  skills.md
  rules.md
  architecture.md
  agents.md
  roadmap.md 


Whenever you add, update, or remove any feature:
1. Update skills.md
2. Update architecture.md if structure changes
3. Update api-contracts.md if API changes
4. Update database-design.md if schema changes
5. Update feature-status.md
6. Update changelog.md


Do not create random architecture.
Follow docs strictly.


Core MVP Features: integrate later
1. User authentication setup
2. User profile/onboarding
3. Donor profile creation
4. Blood request creation
5. Nearby donor search
6. Donor eligibility logic
7. Request lifecycle
8. Notification-ready structure
9. Admin-ready backend structure
 

 

Backend Folder Structure:  For now only folder structure setup , not write functionality
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
    location/


Backend Rules:
- Controllers only handle request/response
- Services contain business logic
- DTOs required for every request
- Use class-validator
- Use response interceptor
- Use global exception filter
- Use ConfigModule
- Use Mongoose schemas
- Add indexes where needed
- Never expose sensitive fields


Frontend Folder Structure: For now only folder structure setup , not write functionality
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


Frontend Rules:
- Use reusable components
- Use shadcn/ui
- Use TanStack Query for API state
- Keep API calls in lib/api or feature api files
- Keep validation schemas separate
- Keep interfaces/types separate
- Use clean responsive UI
- No hardcoded API URLs; use env variables


Initial Backend Tasks:
1. Setup NestJS project
2. Setup ConfigModule
3. Setup MongoDB connection
4. Setup global prefix /api/v1
5. Setup CORS
6. Setup response interceptor
7. Setup exception filter
8. Create auth module skeleton


Initial Frontend Tasks:
1. Setup Next.js project
2. Setup Tailwind CSS
3. Setup shadcn/ui
4. Setup Axios client instance
5. Setup TanStack Query provider
6. Setup app layout


Create these docs first before implementation.
Then implement initial frontend and backend setup.
