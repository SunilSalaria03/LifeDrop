Create a professional and fully responsive Auth User Profile page for the blood donation application.

Requirements:
- Follow the existing application theme, UI style, colors, typography, and spacing.
- The page must be mobile, tablet, and desktop responsive.
- Use clean modern UI with Tailwind CSS and shadcn/ui components.

Profile Page Features:
- Show authenticated user information:
  - Profile image/avatar
  - Full name
  - Email
  - Phone number
  - Gender
  - Blood group
  - City and State
  - Account created date
  - Verification status
- Add edit profile functionality.
- Add update profile form with validation.
- Use proper loading states and error handling.

Donor Logic:
- If user is already a donor:
  - Show donor badge/status.
  - Show donor availability status.
  - Show last donation date if available.
  - Show option to update donor details.
- If user is NOT a donor:
  - Show a professional highlighted section/card.
  - Add “Join as a Donor” button.
  - Clicking button should navigate to donor registration/setup flow.
  - Explain short benefits/message encouraging blood donation.

UI/UX:
- Add profile stats/cards design.
- Use responsive grid layout.
- Use clean card sections for personal info and donor info.
- Add smooth hover and transition effects.
- Sidebar/header layout should work properly on all screen sizes.

Technical Requirements:
- Keep all existing authentication and backend functionality working.
- Integrate with existing APIs and auth state.
- Use TypeScript interfaces properly.
- Use React Hook Form or Formik with validation.
- Add reusable components where possible.
- Use best practice folder structure.
- Handle empty/null data safely.
- Add skeleton loaders while fetching profile data.

Optional Enhancements:
- Add profile completion progress bar.
- Add upload/change profile picture functionality.
- Add donor activity/history section.
- Add emergency contact information section.






Profile update optimisation--------------

Read existing auth/profile flow before changes.

Update Google Login + Profile/Donor flow:

1. Google Login OTP Flow

* After successful Google login/signup, DO NOT redirect user to any page/component for phone verification.
* Open same auth modal and directly show OTP verify UI inside modal.
* Flow should be exactly same as existing phone login OTP flow.
* Google auth success → ask phone → send OTP → verify OTP in same modal.
* No separate route/page/component.
* Reuse existing OTP modal logic/components/apis.
* After OTP verification complete, continue existing after login flow.

2. Update Profile Changes (Normal User)

* In update profile form:

  * phone/mobile field must always be disabled/read-only because already verified.
  * when user updates state/city/district, automatically update latitude & longitude as well.
  * keep existing profile functionality same.

3. Join as a donor flow

* If logged-in user role = normal user:

  * "Join as a Donor" button should open/fill only donor-required fields.
  * phone verification step must NOT appear again because phone already verified.
  * phone input remains disabled here also.
  * existing profile data should prefill automatically.

4. Data Rules

* Avoid duplicate keys:

  * use single field only for name
  * use single field only for phone/mobile
* Keep existing APIs and auth flow optimized.
* Do not create unnecessary components/routes.
* Reuse existing modal, OTP flow, validation, and state management.
* Response should contain only required code changes, no theory/explanation.
