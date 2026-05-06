import * as yup from 'yup';

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
      'Enter a 10 digit Indian mobile number.',
      (value) => !value || /^\d{10}$/.test(value),
    )
    .optional(),
  state: yup.string().trim().required('State is required.'),
  stateCode: yup.string().trim().required('State is required.'),
  city: yup.string().trim().required('City is required.'),
  district: yup.string().trim().optional(),
  addressText: yup.string().trim().optional(),
  lat: yup.number().optional(),
  lng: yup.number().optional(),
});

export const profilePhoneSchema = yup.object({
  phone: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, 'Enter a 10 digit Indian mobile number.')
    .required('Phone number is required.'),
  otp: yup.string().trim().matches(/^\d{6}$/, 'Enter the 6 digit OTP.').optional(),
});

export type ProfileSetupValues = yup.InferType<typeof profileSetupSchema>;
export type ProfilePhoneValues = yup.InferType<typeof profilePhoneSchema>;
