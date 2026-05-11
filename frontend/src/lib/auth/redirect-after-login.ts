import { AuthResponse } from '@/features/auth/types/auth.types';
import { RouterLike } from './auth.types';

export function redirectAfterLogin(
  authResponse: AuthResponse,
  router: RouterLike,
  redirect?: string | null,
) {
  if (!authResponse.user.phoneVerified) {
    const target = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';
    router.push(`/profile/setup${target}`);
    return;
  }

  router.push(redirect || '/');
}
