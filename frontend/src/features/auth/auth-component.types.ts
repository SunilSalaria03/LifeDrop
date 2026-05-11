import { AuthUser } from './types/auth.types';
import { ReactNode } from 'react';

export type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated?: (user: AuthUser) => void;
  initialPhone?: string;
  profileUser?: AuthUser;
  profileRedirect?: string;
};

export type AuthStep = 'login' | 'otp';

export type OtpFlow = 'login' | 'profile';

export type PhoneOtpFormProps = {
  mode: 'send' | 'verify';
};

export type GoogleLoginButtonProps = {
  onAuthenticated?: (user: AuthUser) => void;
  onSuccess?: () => void;
};

export type AuthGuardProps = {
  children: ReactNode;
};
