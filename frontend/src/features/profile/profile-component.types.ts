import { AuthUser } from '@/features/auth/types/auth.types';

export type ProfileSetupFormProps = {
  user: AuthUser;
};

export type PhoneVerificationFormProps = {
  user: AuthUser;
};
