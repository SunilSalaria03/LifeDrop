import * as yup from 'yup';
import { donorProfileSchema } from './donor.validation';

export type DonorProfileValues = yup.InferType<typeof donorProfileSchema>;
