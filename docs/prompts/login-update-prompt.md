Update the user schema, APIs, and Update Profile component based on the attached donor/profile form UI.

Extract and use these fields:

Login Information:
- fullName
- email
- mobileNo 

Donor Information:
- bloodGroup
- gender
- birthDate
- birthMonth
- birthYear
- weight
- lastDonationDay
- lastDonationMonth
- lastDonationYear

Contact Information:
- showMobile
- smsAlert
- pinCode
- state
- district 
 

Backend Requirements:
- Update User schema/model with these fields.
- Update DTOs/interfaces for create user, update profile, and donor profile.
- Add proper validation for required fields.
- Keep optional fields optional, especially last donation date.
- Update signup/profile update APIs to save these fields.
- Update get profile API to return all required profile fields.
- Ensure existing auth, login, OTP, and API functionality does not break.

Frontend Requirements:
- Create/update the Update Profile component using this form structure:
  1. Login Information
  2. Donor Information
  3. Contact Information
- Follow the same field layout shown in the UI.
- Make the form fully responsive for mobile, tablet, and desktop.
- Use existing project theme, Tailwind CSS, and UI components.
- Add proper validation messages.
- Add loading state on submit.
- Show success/error toast after API response.
- Pre-fill form values from authenticated user profile API.
- On submit, call update profile API and update auth/user state.

Form Behavior:
- Use dropdowns for blood group, gender, day, month, year, show mobile, SMS alert, state, district, and tehsil.
- Use input fields for full name, email, mobile number,  weight, and pin code.
- Disable or make district/tehsil dependent on selected state if existing location logic supports it.
- Last donation date should be optional. 

Best Practices:
- Keep validation schema in a separate file.
- Keep TypeScript interfaces/types in a separate file.
- Use reusable form field components where possible.
- Handle null/empty backend values safely.
- Do not break existing donor registration, login, OTP verification, or profile functionality.









Read project md files: skills, agents, architecture. Do not read prompt dir.

Task:
Refactor auth, profile, and donor flow.

Rules:
- No duplicate keys.
- Use only:
  - name
  - phone
- Remove fullName/mobileNo usage everywhere.
- No password field/store in DB.
- pincode optional.

Google Login Flow:
- After Google login/signup:
  - redirect user to phone verification page/modal.
  - user must verify phone via OTP.
- Until phone verified:
  - user cannot join as a donor.
  - donor form/button action should redirect to phone verification first.

Join as a donor flow:
- If user phone not verified:
  - redirect to phone verification first.
- After successful verification:
  - open complete donor form in single screen.
- No multi-step flow.
- Single submit only.

Normal User Fields:
- name
- email
- phone
- state
- district
- tehsil
- pincode
- profileImage= value will be statis already set.

Donor Fields:
- bloodGroup
- gender
- birthDate
- weight
- lastDonationDate
- showMobile
- smsAlert
- all normal user fields

Profile Logic:
- Normal user → only basic fields.
- Donor role → donor + basic fields.
- Join as a donor updates role instantly after successful submit.

Backend:
- Update schema, DTOs, validation, APIs.
- Add phoneVerified boolean.
- Donor creation allowed only if phoneVerified=true.
- Keep existing auth/APIs working.

Frontend:
- Update login/google/OTP flow.
- Add phone verification modal/page.
- Update profile form UI.
- Fully responsive.
- Prefill existing data.
- Validation + loaders + toasts.
- Use existing theme/components/patterns.