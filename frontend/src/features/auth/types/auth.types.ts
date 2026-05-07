export type AuthProvider = 'phone' | 'google';
export type UserRole = 'user' | 'donor' | 'admin';
export type Gender = 'male' | 'female' | 'other';

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
  phoneVerified: boolean;
  isProfileCompleted: boolean;
  isBlocked: boolean;
  addressText?: string;
  bloodGroup?: string;
  gender?: Gender;
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
