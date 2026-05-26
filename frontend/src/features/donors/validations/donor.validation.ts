import * as yup from 'yup';
import {
  INDIAN_MOBILE_VALIDATION_MESSAGE,
  isValidIndianNationalNumber,
} from '@/lib/phone/india-phone';

const parseDateFromInput = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
};

const getTodayAtMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const donorProfileSchema = yup.object({
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
  bloodGroup: yup.string().trim().required('Blood group is required.'),
  gender: yup.string().trim().oneOf(['male', 'female', 'other'], 'Select a valid gender.').required('Gender is required.'),
  birthDate: yup
    .string()
    .trim()
    .required('Birth date is required.')
    .test(
      'minimum-age-18',
      'You must be at least 18 years old.',
      (value) => {
        const birthDate = parseDateFromInput(value);
        if (!birthDate) {
          return false;
        }

        const latestEligibleBirthDate = getTodayAtMidnight();
        latestEligibleBirthDate.setFullYear(
          latestEligibleBirthDate.getFullYear() - 18,
        );

        return birthDate <= latestEligibleBirthDate;
      },
    ),
  weight: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value,
    )
    .typeError('Enter a valid weight.')
    .min(1, 'Enter a valid weight.')
    .required('Weight is required.'),
  lastDonationDate: yup
    .string()
    .trim()
    .optional()
    .test(
      'minimum-gap-90-days',
      'Last donation date must be at least 90 days ago.',
      (value) => {
        if (!value) {
          return true;
        }

        const lastDonationDate = parseDateFromInput(value);
        if (!lastDonationDate) {
          return false;
        }

        const latestAllowedDonationDate = getTodayAtMidnight();
        latestAllowedDonationDate.setDate(
          latestAllowedDonationDate.getDate() - 90,
        );

        return lastDonationDate <= latestAllowedDonationDate;
      },
    ),
  showMobile: yup.boolean().required(),
  smsAlert: yup.boolean().required(),
  state: yup.string().trim().required('State is required.'),
  stateCode: yup.string().trim().required('State is required.'),
  district: yup.string().trim().required('District is required.'),
  tehsil: yup.string().trim().optional(),
  addressLine: yup.string().trim().required('Address line is required.'),
  pincode: yup
    .string()
    .trim()
    .matches(/^\d{6}$/, {
      excludeEmptyString: true,
      message: 'Enter a 6 digit pincode.',
    })
    .required('Pincode is required.'),
  lat: yup.number().required('District coordinates are required.'),
  lng: yup.number().required('District coordinates are required.'),
  isAvailable: yup.boolean().optional(),
});
