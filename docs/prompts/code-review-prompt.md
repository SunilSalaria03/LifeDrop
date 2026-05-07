Review my current codebase as a senior full-stack engineer.

Goal:
Check functionality, code quality, best practices, folder structure, performance, security, and maintainability.

Project:
LifeDrop blood donation platform

Tech Stack:
Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Axios
- Formik with useFormik only

Backend:
- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT Auth
- Twilio OTP
- Google Auth

Review Scope:
1. Check if current functionality is working correctly
2. Find bugs or broken flows
3. Remove unnecessary code
4. Remove duplicate logic
5. Optimize code structure
6. Improve naming conventions
7. Improve TypeScript types/interfaces
8. Improve API error handling
9. Improve validation
10. Improve security
11. Improve reusable components/services
12. Check environment variable usage
13. Check auth flow correctness
14. Check folder structure against docs
15. Update docs if code changes

Important Rules:
- Do not rewrite the full project unnecessarily
- Do not change working logic without reason
- Do not introduce breaking changes
- Keep code clean and production-ready
- Use existing architecture
- Follow /docs/skills.md, rules.md, architecture.md, api-contracts.md, and database-design.md
- Remove unused imports, unused variables, dead code, console logs, and commented code
- Keep controllers thin and services responsible for business logic
- Keep frontend API logic separate from UI components
- Keep validation schemas separate
- Keep types/interfaces separate
- Use meaningful names
- Use proper error messages
- Avoid any hardcoded URLs or secrets
- Ensure all protected APIs use auth guards
- Ensure sensitive fields are not returned in API responses

Backend Review:
- Check NestJS modules
- Check DTO validation
- Check Mongoose schemas and indexes
- Check Auth module
- Check JWT and refresh token handling
- Check Twilio OTP flow
- Check Google auth flow
- Check exception filters and interceptors
- Check service/controller separation
- Check API response format

Frontend Review:
- Check Next.js App Router structure
- Check auth pages
- Check form validation
- Check TanStack Query usage
- Check Axios interceptor
- Check token storage
- Check protected routes
- Check loading/error states
- Check reusable components
- Check responsive UI

Output Required:
1. First give me a clear review summary
2. List issues found by priority:
   - Critical
   - High
   - Medium
   - Low
3. Explain what changes are needed
4. Apply safe improvements directly
5. Show changed files list
6. Update docs if needed
7. Do not make unnecessary UI redesign
8. Do not add new features unless required for fixing existing flow

After changes:
- Run TypeScript/build checks if available
- Fix lint/type errors
- Ensure app starts successfully
- Add a short changelog entry