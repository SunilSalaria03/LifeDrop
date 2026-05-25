import * as yup from 'yup';
import {
  INDIAN_MOBILE_VALIDATION_MESSAGE,
  isValidIndianNationalNumber,
} from '@/lib/phone/india-phone';

export const phoneOtpSendSchema = yup.object({
  phone: yup
    .string()
    .trim()
    .test(
      'valid-indian-mobile',
      INDIAN_MOBILE_VALIDATION_MESSAGE,
      (value) => isValidIndianNationalNumber(value),
    )
    .required('Phone number is required.')
});

export const phoneOtpVerifySchema = yup.object({
  otp: yup
    .string()
    .trim()
    .matches(/^\d{6}$/, 'Enter the 6 digit OTP.')
    .required('OTP is required.')
});
