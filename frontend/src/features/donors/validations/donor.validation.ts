import * as yup from 'yup';

export const donorProfileSchema = yup.object({
  bloodGroup: yup.string().required('Blood group is required.'),
  phone: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, 'Enter a 10 digit Indian mobile number.')
    .required('Phone is required.'),
  alternatePhone: yup
    .string()
    .trim()
    .test(
      'optional-e164',
      'Enter a 10 digit Indian mobile number.',
      (value) => !value || /^\d{10}$/.test(value),
    ),
  state: yup.string().required('State is required.'),
  stateCode: yup.string().required('State is required.'),
  city: yup.string().required('City is required.'),
  district: yup.string().optional(),
  addressText: yup.string().optional(),
  lat: yup.number().required('City coordinates are required.'),
  lng: yup.number().required('City coordinates are required.'),
  lastDonationDate: yup.string().optional(),
  isAvailable: yup.boolean().optional(),
});

export type DonorProfileValues = yup.InferType<typeof donorProfileSchema>;
