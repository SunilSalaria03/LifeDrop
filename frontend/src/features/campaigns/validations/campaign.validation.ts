import * as yup from 'yup';
import {
  INDIAN_MOBILE_VALIDATION_MESSAGE,
  isValidIndianNationalNumber,
} from '@/lib/phone/india-phone';

export const createCampaignSchema = yup.object({
  title: yup.string().trim().required('Campaign title is required.'),
  shortDescription: yup.string().trim().required('Short summary is required.'),
  description: yup.string().trim().required('Description is required.'),
  type: yup
    .string()
    .trim()
    .oneOf(['blood_donation', 'awareness', 'health_checkup'])
    .required('Campaign type is required.'),
  organizerType: yup
    .string()
    .trim()
    .oneOf(['individual', 'hospital', 'ngo', 'college', 'company'])
    .required('Organizer type is required.'),
  organizer: yup.string().trim().required('Organizer name is required.'),
  organizerPhone: yup
    .string()
    .trim()
    .test(
      'valid-organizer-phone',
      INDIAN_MOBILE_VALIDATION_MESSAGE,
      (value) => isValidIndianNationalNumber(value),
    )
    .required('Organizer phone is required.'),
  organizerEmail: yup
    .string()
    .trim()
    .email('Enter a valid organizer email.')
    .optional(),
  contactName: yup.string().trim().optional(),
  contactPhone: yup
    .string()
    .trim()
    .test(
      'optional-contact-phone',
      INDIAN_MOBILE_VALIDATION_MESSAGE,
      (value) => !value || isValidIndianNationalNumber(value),
    )
    .optional(),
  contactEmail: yup
    .string()
    .trim()
    .email('Enter a valid contact email.')
    .optional(),
  stateCode: yup.string().trim().required('State is required.'),
  state: yup.string().trim().required('State is required.'),
  district: yup.string().trim().required('District is required.'),
  city: yup.string().trim().required('City is required.'),
  pincode: yup
    .string()
    .trim()
    .matches(/^\d{6}$/, 'Enter a 6 digit pincode.')
    .required('Pincode is required.'),
  venue: yup.string().trim().required('Venue is required.'),
  address: yup.string().trim().required('Address is required.'),
  startDate: yup.string().trim().required('Start date is required.'),
  endDate: yup
    .string()
    .trim()
    .required('End date is required.')
    .test(
      'end-after-start',
      'End date cannot be before start date.',
      (value, context) => {
        const startDate = context.parent.startDate as string | undefined;
        if (!startDate || !value) {
          return true;
        }

        return new Date(value).getTime() >= new Date(startDate).getTime();
      },
    ),
  startTime: yup.string().trim().optional(),
  endTime: yup.string().trim().optional(),
  capacity: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value,
    )
    .typeError('Enter a valid capacity.')
    .min(1, 'Capacity must be at least 1.')
    .required('Capacity is required.'),
  bloodGroupsNeeded: yup
    .array()
    .of(yup.string().trim())
    .when('type', {
      is: 'blood_donation',
      then: (schema) =>
        schema.min(
          1,
          'Select at least one blood group for blood donation campaigns.',
        ),
      otherwise: (schema) => schema.optional(),
    }),
});
