import * as yup from 'yup';

export const phoneOtpSendSchema = yup.object({
  phone: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, 'Enter a 10 digit Indian mobile number.')
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
