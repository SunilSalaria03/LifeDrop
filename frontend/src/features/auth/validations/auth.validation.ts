import * as yup from 'yup';

export const phoneOtpSendSchema = yup.object({
  phone: yup
    .string()
    .trim()
    .matches(/^\+[1-9]\d{7,14}$/, 'Use E.164 format, for example +919999999999.')
    .required('Phone number is required.')
});

export const phoneOtpVerifySchema = yup.object({
  otp: yup
    .string()
    .trim()
    .matches(/^\d{6}$/, 'Enter the 6 digit OTP.')
    .required('OTP is required.')
});

export type PhoneOtpSendValues = yup.InferType<typeof phoneOtpSendSchema>;
export type PhoneOtpVerifyValues = yup.InferType<typeof phoneOtpVerifySchema>;

