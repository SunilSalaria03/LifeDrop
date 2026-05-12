import * as yup from 'yup';

export const donorProfileSchema = yup.object({
  name: yup.string().trim().min(2, 'Enter your full name.').required('Name is required.'),
  email: yup.string().trim().email('Enter a valid email address.').optional(),
  phone: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, 'Enter a 10 digit Indian mobile number.')
    .required('Mobile number is required.'),
  bloodGroup: yup.string().trim().required('Blood group is required.'),
  gender: yup.string().trim().oneOf(['male', 'female', 'other'], 'Select a valid gender.').required('Gender is required.'),
  birthDate: yup.string().trim().required('Birth date is required.'),
  weight: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || Number.isNaN(value) ? undefined : value,
    )
    .min(1, 'Enter a valid weight.')
    .required('Weight is required.'),
  lastDonationDate: yup.string().trim().optional(),
  showMobile: yup.boolean().required(),
  smsAlert: yup.boolean().required(),
  state: yup.string().trim().required('State is required.'),
  stateCode: yup.string().trim().required('State is required.'),
  district: yup.string().trim().required('District is required.'),
  tehsil: yup.string().trim().optional(),
  addressLine: yup.string().trim().optional(),
  pincode: yup
    .string()
    .trim()
    .matches(/^\d{6}$/, {
      excludeEmptyString: true,
      message: 'Enter a 6 digit pincode.',
    })
    .optional(),
  lat: yup.number().required('District coordinates are required.'),
  lng: yup.number().required('District coordinates are required.'),
  isAvailable: yup.boolean().optional(),
});
