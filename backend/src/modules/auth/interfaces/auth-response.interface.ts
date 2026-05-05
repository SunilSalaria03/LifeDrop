import { AuthProvider, GeoPoint, UserRole } from '../../users/schemas/user.schema';

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  authProvider: AuthProvider;
  role: UserRole;
  isPhoneVerified: boolean;
  isProfileCompleted: boolean;
  isBlocked: boolean;
  addressText?: string;
  state?: string;
  city?: string;
  district?: string;
  location?: GeoPoint;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
