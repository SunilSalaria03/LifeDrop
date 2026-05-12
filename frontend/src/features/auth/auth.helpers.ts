import { AuthResponse } from './types/auth.types';
import { userStorage } from '@/lib/auth/user-storage';
import { getSearchParam } from '@/lib/navigation/safe-url';

export function storeAuthTokens(authResponse: AuthResponse) {
  userStorage.setUser(authResponse.user);
}

export function getRedirectParam() {
  return getSearchParam('redirect');
}
