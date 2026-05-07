Tese are sub task for reduce tokens spends
Subtask 1: Backend schema + DTO
Create BloodRequest schema and SendSmsAlertDto.

Requirements:
- Read existing backend structure first.
- Add blood-requests module if missing.
- Schema fields:
  requesterId, donorId, bloodGroup, status, sendSms, consentToShareContact,
  smsStatus, smsProvider, smsProviderMessageId, smsError, message.
- status enum: pending, sent, failed, accepted, rejected, expired.
- smsStatus enum: pending, sent, failed.
- Validate donorId, bloodGroup, sendSms, consentToShareContact.
- consentToShareContact must be true.
- Keep code consistent with existing project patterns.
- Output only changed/created files.



Subtask 2: Twilio SMS service logic

Implement SMS alert sending inside blood-request.service.ts only.

Requirements:
- Do not create notification module.
- Use Twilio from env:
  TWILIO_ACCOUNT_SID
  TWILIO_AUTH_TOKEN
  TWILIO_PHONE_NUMBER
- Verify logged-in requester exists.
- Requester phone must be verified.
- Donor must exist.
- Donor phone must be verified.
- Donor must be available.
- Create BloodRequest with smsStatus pending.
- Send SMS to donor mobile number.
- On success update smsStatus sent, status sent, smsProviderMessageId.
- On failure update smsStatus failed, status failed, smsError.
- Return clean success/error response.
- Output only changed/created files.


Subtask 3: Backend controller API

Create API endpoint:
POST /api/v1/blood-requests/send-sms-alert

Requirements:
- Use existing auth guard/user decorator pattern.
- Body should use SendSmsAlertDto.
- Call bloodRequestService.sendSmsAlert().
- Return same response format used in project.
- Do not expose Twilio error details directly to frontend.
- Output only changed/created files.


Subtask 4: Frontend request modal

Create RequestBloodModal component.

Requirements:
- Read existing frontend structure/components first.
- Use shadcn/ui components already used in project.
- Props:
  open, onOpenChange, donor, onSuccess
- Show donor name, blood group, city.
- Add checkbox: Send SMS alert.
- Add checkbox: I agree to share my contact details with donor.
- Optional textarea message.
- Send button disabled unless both checkboxes are checked.
- Show loading state while submitting.
- Show success/error toast.
- Output only changed/created files.


Subtask 5: Frontend API integration

Integrate RequestBloodModal with donor search/list card.

Requirements:
- Add Request button on donor card/list item.
- On click open RequestBloodModal with selected donor.
- Create API function for:
  POST /blood-requests/send-sms-alert
- Payload:
  donorId, bloodGroup, sendSms, consentToShareContact, message
- Use existing API client/fetch wrapper.
- On success close modal and refresh/update UI if needed.
- Output only changed/created files.


Subtask 6: Validation + anti-spam checks


Add basic anti-spam validation in sendSmsAlert backend.

Requirements:
- Same requester cannot send SMS alert to same donor again within 30 minutes.
- If active request already exists with status pending/sent, block duplicate request.
- Return user-friendly error message.
- Keep logic simple without queue/Redis.
- Output only changed/created files.


Subtask 7: Final QA pass


Review and fix Request Blood SMS flow end-to-end.

Check:
- TypeScript errors
- DTO validation
- Auth guard usage
- Twilio env handling
- Phone number formatting with +91 support
- Modal loading/disabled states
- Toast success/error messages
- API error handling
- No WhatsApp code
- No BullMQ/Redis
- No notification module

Output only final changed files and short testing steps.