import { AuthUser } from '@/features/auth/types/auth.types';

export type TokenRefreshResponse = {
  data?: {
    user?: AuthUser;
  };
};
