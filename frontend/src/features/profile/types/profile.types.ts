import { AuthUser } from '@/features/auth/types/auth.types';

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  state?: string;
  city?: string;
  district?: string;
  addressText?: string;
  lat?: number;
  lng?: number;
};

export type VerifyProfilePhonePayload = {
  phone: string;
  otp: string;
};

export type ProfileUser = AuthUser;
