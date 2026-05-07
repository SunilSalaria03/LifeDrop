import { AuthUser } from '@/features/auth/types/auth.types';

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  profileImage?: string;
  email?: string;
  bloodGroup?: string;
  gender?: string;
  birthDate?: string;
  weight?: number;
  lastDonationDate?: string;
  showMobile?: boolean;
  smsAlert?: boolean;
  pincode?: string;
  state?: string;
  city?: string;
  district?: string;
  tehsil?: string;
  addressText?: string;
  lat?: number;
  lng?: number;
};

export type VerifyProfilePhonePayload = {
  phone: string;
  otp: string;
};

export type ProfileUser = AuthUser;
