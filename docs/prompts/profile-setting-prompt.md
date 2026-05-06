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
  - Add “Become a Donor” button.
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