import { AuthResponse } from './types/auth.types';
import { userStorage } from '@/lib/auth/user-storage';

export function storeAuthTokens(authResponse: AuthResponse) {
  userStorage.setUser(authResponse.user);
}

export function getRedirectParam() {
  if (typeof window === 'undefined') {
    return null;
  }

  return new URLSearchParams(window.location.search).get('redirect');
}
