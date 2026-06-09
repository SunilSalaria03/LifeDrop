import * as yup from 'yup';
import {
  INDIAN_MOBILE_VALIDATION_MESSAGE,
  isValidIndianNationalNumber,
} from '@/lib/phone/india-phone';

const parseIsoDate = (value: string): Date | null => {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getMaxBirthDate = () => {
  const today = startOfDay(new Date());
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
};

const getMaxLastDonationDate = () => {
  const today = startOfDay(new Date());
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() - 90);
  return maxDate;
};

export const profileSetupSchema = yup.object({
  name: yup.string().trim().min(2, 'Enter your full name.').required('Name is required.'),
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
  addressText: yup.string().trim().required('Address line is required.'),
  addressLine: yup.string().trim().optional(),
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
  birthDate: yup
    .string()
    .trim()
    .test(
      'birth-date-min-age',
      'Birth date must be at least 18 years ago.',
      (value) => {
        if (!value) {
          return true;
        }
        const parsed = parseIsoDate(value);
        if (!parsed) {
          return false;
        }
        return parsed <= getMaxBirthDate();
      },
    )
    .optional(),
  weight: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value,
    )
    .typeError('Enter a valid weight.')
    .min(1, 'Enter a valid weight.')
    .optional(),
  lastDonationDate: yup
    .string()
    .trim()
    .test(
      'last-donation-min-90-days',
      'Last donation date must be at least 90 days ago.',
      (value) => {
        if (!value) {
          return true;
        }
        const parsed = parseIsoDate(value);
        if (!parsed) {
          return false;
        }
        return parsed <= getMaxLastDonationDate();
      },
    )
    .optional(),
  showMobile: yup.boolean().optional(),
  showEmail: yup.boolean().optional(),
  smsAlert: yup.boolean().optional(),
  pincode: yup
    .string()
    .trim()
    .matches(/^\d{6}$/, {
      excludeEmptyString: true,
      message: 'Enter a 6 digit pin code.',
    })
    .required("Pin code is required."),
  state: yup.string().trim().required('State is required.'),
  stateCode: yup.string().trim().required('State is required.'),
  district: yup.string().trim().required('District is required.'),
  tehsil: yup.string().trim().optional(),
  addressLine: yup.string().trim().required("Address line is required."),
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
