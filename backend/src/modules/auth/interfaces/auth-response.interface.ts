import {
  AuthProvider,
  Gender,
  GeoPoint,
  UserRole,
} from '../../users/schemas/user.schema';

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  authProvider: AuthProvider;
  role: UserRole;
  phoneVerified: boolean;
  isProfileCompleted: boolean;
  isBlocked: boolean;
  addressText?: string;
  bloodGroup?: string;
  gender?: Gender;
  birthDate?: Date;
  weight?: number;
  lastDonationDate?: Date;
  showMobile?: boolean;
  smsAlert?: boolean;
  pincode?: string;
  state?: string;
  city?: string;
  district?: string;
  tehsil?: string;
  location?: GeoPoint;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
