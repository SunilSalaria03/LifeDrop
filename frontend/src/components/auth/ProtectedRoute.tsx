'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { userStorage } from '@/lib/auth/user-storage';

type ProtectedRouteProps = {
  children: ReactNode;
  requireCompletedProfile?: boolean;
};

export function ProtectedRoute({
  children,
  requireCompletedProfile = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { meQuery } = useAuth();

  useEffect(() => {
    const redirect = new URLSearchParams(window.location.search).get('redirect');

    if (meQuery.isError) {
      const currentPath = window.location.pathname;
      router.replace(`/?auth=login&redirect=${encodeURIComponent(redirect || currentPath)}`);
    }

    if (
      requireCompletedProfile &&
      meQuery.data &&
      !meQuery.data.isProfileCompleted
    ) {
      const target = redirect || window.location.pathname;
      router.replace(`/profile/setup?redirect=${encodeURIComponent(target)}`);
    }
  }, [meQuery.data, meQuery.isError, requireCompletedProfile, router]);

  useEffect(() => {
    if (meQuery.isError) {
      userStorage.clearUser();
    }
  }, [meQuery.isError]);

  if (meQuery.isLoading) {
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
