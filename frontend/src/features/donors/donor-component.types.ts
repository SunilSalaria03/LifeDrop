import { ReactNode } from 'react';
import { AuthUser } from '@/features/auth/types/auth.types';
import { DonorListItem } from './types/donor.types';

export type BecomeDonorFormProps = {
  user: AuthUser;
};

export type FieldLabelProps = {
  children: ReactNode;
  htmlFor?: string;
};

export type RequestBloodModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donor: DonorListItem | null;
  onSuccess?: () => void;
};
