import * as yup from 'yup';
import {
  profilePhoneSchema,
  profileSetupSchema,
  updateProfileFormSchema,
} from './profile.validation';

export type ProfileSetupValues = yup.InferType<typeof profileSetupSchema>;
export type UpdateProfileFormValues = yup.InferType<typeof updateProfileFormSchema>;
export type ProfilePhoneValues = yup.InferType<typeof profilePhoneSchema>;
