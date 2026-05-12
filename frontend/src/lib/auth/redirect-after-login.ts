import { AuthResponse } from '@/features/auth/types/auth.types';
import { RouterLike } from './auth.types';
import { getSafeInternalPath } from '@/lib/navigation/safe-url';

export function redirectAfterLogin(
  authResponse: AuthResponse,
  router: RouterLike,
  redirect?: string | null,
) {
  const target = redirect ? getSafeInternalPath(redirect) : null;

  if (!authResponse.user.phoneVerified) {
    const setupRedirect = target
      ? `?redirect=${encodeURIComponent(target)}`
      : '';
    router.push(`/profile/setup${setupRedirect}`);
    return;
  }

  router.push(target || '/');
}
