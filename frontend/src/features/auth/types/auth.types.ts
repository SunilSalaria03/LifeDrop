export type AuthProvider = 'phone' | 'google';
export type UserRole = 'user' | 'donor' | 'admin';

export type LocationPoint = {
  type: 'Point';
  coordinates: [number, number];
};

export type AuthUser = {
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
  location?: LocationPoint;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type PhoneOtpSendPayload = {
  phone: string;
};

export type PhoneOtpVerifyPayload = {
  phone: string;
  otp: string;
};

export type GoogleAuthPayload = {
  idToken: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
};
