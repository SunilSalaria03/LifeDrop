export enum AuthProvider {
  Phone = 'phone',
  Google = 'google',
}

export enum UserRole {
  Admin = 'admin',
}

export type UserRecord = {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  authProvider: AuthProvider;
  role: UserRole;
  phoneVerified: boolean;
  isProfileCompleted: boolean;
  isBlocked: boolean;
};
