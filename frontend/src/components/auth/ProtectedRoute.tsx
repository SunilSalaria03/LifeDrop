'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { userStorage } from '@/lib/auth/user-storage';
import { getSafeInternalPath, getSearchParam, withAuthLogin } from '@/lib/navigation/safe-url';
import { ProtectedRouteProps } from './protected-route.types';

export function ProtectedRoute({
  children,
  requireCompletedProfile = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthLoading, meQuery } = useAuth();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    const redirect = getSearchParam('redirect');

    if (meQuery.isError) {
      router.replace(withAuthLogin('/', redirect || pathname));
      return;
    }

    if (
      requireCompletedProfile &&
      meQuery.data &&
      !meQuery.data.isProfileCompleted
    ) {
      const target = getSafeInternalPath(redirect || pathname);
      router.replace(`/profile/setup?redirect=${encodeURIComponent(target)}`);
    }
  }, [
    isAuthLoading,
    meQuery.data,
    meQuery.isError,
    pathname,
    requireCompletedProfile,
    router,
  ]);

  useEffect(() => {
    if (meQuery.isError) {
      userStorage.clearUser();
    }
  }, [meQuery.isError]);

  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-10">
        <Card className="mx-auto max-w-md rounded-2xl">
          <CardContent className="p-6 text-sm text-neutral-600">
            Checking your session...
          </CardContent>
        </Card>
      </main>
    );
  }

  if (meQuery.isError) {
    return null;
  }

  if (requireCompletedProfile && !meQuery.data?.isProfileCompleted) {
    return null;
  }

  return <>{children}</>;
}
