import { AuthResponse } from '@/features/auth/types/auth.types';

type RouterLike = {
  push: (href: string) => void;
};

export function redirectAfterLogin(
  authResponse: AuthResponse,
  router: RouterLike,
  redirect?: string | null,
) {
  const redirectQuery = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';

  if (!authResponse.user.isProfileCompleted) {
    router.push(`/profile/setup${redirectQuery}`);
    return;
  }

  router.push(redirect || '/');
}
