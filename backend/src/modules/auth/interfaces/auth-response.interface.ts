import {
  AuthProvider,
  Gender,
  UserRole,
} from '../../users/schemas/user.schema';
import type { BloodGroup } from '../../donors/schemas/donor-profile.schema';
import { GeoPoint } from '../../users/schemas/user.schema.types';

export interface AuthDonorProfile {
  id: string;
  userId?: string;
  bloodGroup: BloodGroup;
  gender?: Gender;
  birthDate?: Date;
  weight?: number;
  phone?: string;
  alternatePhone?: string;
  state: string;
  city: string;
  district?: string;
  tehsil?: string;
  addressLine?: string;
  addressText?: string;
  showMobile?: boolean;
  showEmail?: boolean;
  smsAlert?: boolean;
  pincode?: string;
  location?: GeoPoint;
  lastDonationDate?: Date;
  nextEligibleDate?: Date;
  isAvailable: boolean;
  isActive?: boolean;
  isVerified?: boolean;
  totalDonations?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  avatarKey?: string;
  authProvider: AuthProvider;
  role: UserRole;
  phoneVerified: boolean;
  isProfileCompleted: boolean;
  isBlocked: boolean;
  addressLine?: string;
  addressText?: string;
  bloodGroup?: string;
  gender?: Gender;
  birthDate?: Date;
  weight?: number;
  lastDonationDate?: Date;
  showMobile?: boolean;
  showEmail?: boolean;
  smsAlert?: boolean;
  pincode?: string;
  state?: string;
  city?: string;
  district?: string;
  tehsil?: string;
  location?: GeoPoint;
  donorProfile?: AuthDonorProfile | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
