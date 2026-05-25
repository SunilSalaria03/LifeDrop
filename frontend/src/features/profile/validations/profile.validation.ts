import * as yup from 'yup';
import {
  INDIAN_MOBILE_VALIDATION_MESSAGE,
  isValidIndianNationalNumber,
} from '@/lib/phone/india-phone';

export const profileSetupSchema = yup.object({
  name: yup.string().trim().min(2, 'Enter your full name.').required('Name is required.'),
  profileImage: yup
    .string()
    .trim()
    .url('Enter a valid image URL.')
    .transform((value) => value || undefined)
    .optional(),
  phone: yup
    .string()
    .trim()
    .test(
      'optional-indian-phone',
      INDIAN_MOBILE_VALIDATION_MESSAGE,
      (value) => !value || isValidIndianNationalNumber(value),
    )
    .optional(),
  state: yup.string().trim().required('State is required.'),
  stateCode: yup.string().trim().required('State is required.'),
  city: yup.string().trim().required('City is required.'),
  district: yup.string().trim().optional(),
  addressLine: yup.string().trim().optional(),
  addressText: yup.string().trim().optional(),
  lat: yup.number().optional(),
  lng: yup.number().optional(),
});

export const updateProfileFormSchema = yup.object({
  name: yup.string().trim().min(2, 'Enter your full name.').required('Name is required.'),
  email: yup.string().trim().email('Enter a valid email address.').optional(),
  phone: yup
    .string()
    .trim()
    .test(
      'valid-indian-phone',
      INDIAN_MOBILE_VALIDATION_MESSAGE,
      (value) => isValidIndianNationalNumber(value),
    )
    .required('Mobile number is required.'),
  bloodGroup: yup.string().trim().optional(),
  gender: yup.string().trim().oneOf(['male', 'female', 'other', ''], 'Select a valid gender.').optional(),
  birthDate: yup.string().trim().optional(),
  weight: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value,
    )
    .typeError('Enter a valid weight.')
    .min(1, 'Enter a valid weight.')
    .optional(),
  lastDonationDate: yup.string().trim().optional(),
  showMobile: yup.boolean().optional(),
  smsAlert: yup.boolean().optional(),
  pincode: yup
    .string()
    .trim()
    .matches(/^\d{6}$/, {
      excludeEmptyString: true,
      message: 'Enter a 6 digit pin code.',
    })
    .optional(),
  state: yup.string().trim().required('State is required.'),
  stateCode: yup.string().trim().required('State is required.'),
  district: yup.string().trim().required('District is required.'),
  tehsil: yup.string().trim().optional(),
  addressLine: yup.string().trim().optional(),
});

export const profilePhoneSchema = yup.object({
  phone: yup
    .string()
    .trim()
    .test(
      'valid-indian-phone',
      INDIAN_MOBILE_VALIDATION_MESSAGE,
      (value) => isValidIndianNationalNumber(value),
    )
    .required('Phone number is required.'),
  otp: yup.string().trim().matches(/^\d{6}$/, 'Enter the 6 digit OTP.').optional(),
});
