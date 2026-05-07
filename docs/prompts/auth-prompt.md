Read all /docs files first: skills.md, rules.md, architecture.md, api-contracts.md, database-design.md, feature-status.md, changelog.md.

Task:
Setup complete Auth module for LifeDrop in both backend and frontend.

Auth methods:
1. Phone number OTP signup/login
2. Google signup/login

Do not add email/password login.

Backend Tech:
- NestJS
- MongoDB
- Mongoose
- JWT
- Passport where useful
- Firebase Admin for phone OTP verification
- Google OAuth / Google ID token verification

Frontend Tech:
- Next.js App Router
- TypeScript
- Tailwind
- shadcn/ui
- TanStack Query
- Axios
- useFormik only
- Validation in separate files
- Types/interfaces in separate files

Backend Requirements:

Create/update these modules:

src/modules/auth/
  auth.module.ts
  auth.controller.ts
  auth.service.ts
  dto/
    phone-otp-send.dto.ts
    phone-otp-verify.dto.ts
    google-auth.dto.ts
    refresh-token.dto.ts
  interfaces/
    auth-response.interface.ts
    jwt-payload.interface.ts
  guards/
    jwt-auth.guard.ts
  strategies/
    jwt.strategy.ts

src/modules/users/
  users.module.ts
  users.service.ts
  schemas/user.schema.ts

User schema should support:
- name
- email
- phone
- profileImage
- authProvider: "phone" | "google"
- googleId
- isPhoneVerified
- isProfileCompleted
- isBlocked
- location
- refreshToken
- createdAt
- updatedAt

APIs:

POST /api/v1/auth/otp/send
Payload:
{
  "phone": "+919999999999"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully"
}

POST /api/v1/auth/otp/verify
Payload:
{
  "phone": "+919999999999",
  "idToken": "firebase_verified_id_token"
}

Behavior:
- Verify Firebase ID token
- Check phone number from Firebase token
- If user does not exist, create user
- If user exists, login user
- Generate accessToken and refreshToken
- Return user and tokens

POST /api/v1/auth/google
Payload:
{
  "idToken": "google_id_token"
}

Behavior:
- Verify Google ID token
- Check user by googleId or email
- If user does not exist, create user
- If user exists, login user
- Generate accessToken and refreshToken
- Return user and tokens

POST /api/v1/auth/refresh
Payload:
{
  "refreshToken": "token"
}

POST /api/v1/auth/logout
Protected route.
Clear refresh token from DB.

GET /api/v1/auth/me
Protected route.
Return logged-in user.

Important backend rules:
- Use DTO validation
- Use ConfigService
- Never expose refreshToken in user response
- Never expose blocked user login
- Add proper error messages
- Add Swagger decorators
- Use global response interceptor format
- Update api-contracts.md
- Update database-design.md
- Update feature-status.md
- Update changelog.md

Required env variables:

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

GOOGLE_CLIENT_ID=

Frontend Requirements:

Create/update:

src/app/auth/login/page.tsx
src/app/auth/otp/page.tsx
src/app/auth/google/page.tsx if needed
src/app/onboarding/page.tsx

src/features/auth/
  api/auth.api.ts
  hooks/useAuth.ts
  types/auth.types.ts
  validations/auth.validation.ts
  components/
    PhoneOtpForm.tsx
    GoogleLoginButton.tsx

src/lib/
  api/axios-client.ts
  auth/token-storage.ts

Frontend Flow:

Phone OTP:
1. User enters phone number
2. Firebase sends OTP from frontend
3. User enters OTP
4. Firebase returns idToken
5. Send phone + idToken to backend /auth/otp/verify
6. Store accessToken and refreshToken
7. Redirect:
   - if isProfileCompleted false → /onboarding
   - else → /dashboard

Google:
1. User clicks Continue with Google
2. Frontend gets Google idToken
3. Send idToken to backend /auth/google
4. Store accessToken and refreshToken
5. Redirect:
   - if isProfileCompleted false → /onboarding
   - else → /dashboard

Frontend rules:
- Use useFormik, not Formik component not with react-hook-form lib
- Put validation schemas separately
- Put interfaces separately
- Use shadcn/ui components
- Show loading states
- Show error messages
- Use clean responsive design
- Do not hardcode API URL
- Use NEXT_PUBLIC_API_BASE_URL
- Use TanStack Query mutation hooks
- Axios should attach Bearer token automatically
- Refresh token handling should be prepared

Also update docs:
- skills.md
- rules.md if needed
- architecture.md
- api-contracts.md
- database-design.md
- feature-status.md
- changelog.md

Do not create duplicate auth logic.
Do not add password login.
Do not skip documentation updates.