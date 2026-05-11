import * as yup from 'yup';
import {
  phoneOtpSendSchema,
  phoneOtpVerifySchema,
} from './auth.validation';

export type PhoneOtpSendValues = yup.InferType<typeof phoneOtpSendSchema>;
export type PhoneOtpVerifyValues = yup.InferType<typeof phoneOtpVerifySchema>;
