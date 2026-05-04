import { AuthProvider, GeoPoint } from '../../users/schemas/user.schema';

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  authProvider: AuthProvider;
  isPhoneVerified: boolean;
  isProfileCompleted: boolean;
  isBlocked: boolean;
  location?: GeoPoint;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

