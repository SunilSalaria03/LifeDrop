'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuardProps } from '../auth-component.types';
import { userStorage } from '@/lib/auth/user-storage';
import { getSafeInternalPath, getSearchParam } from '@/lib/navigation/safe-url';
import { useAuth } from '../hooks/useAuth';

export function AuthGuestGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthLoading, meQuery } = useAuth();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (meQuery.data) {
      const redirect = getSearchParam('redirect');
      userStorage.setUser(meQuery.data);
      router.replace(getSafeInternalPath(redirect));
      return;
    }

    if (meQuery.isError) {
      userStorage.clearUser();
    }
  }, [isAuthLoading, meQuery.data, meQuery.isError, router]);

  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10 text-neutral-950">
        <section className="mx-auto max-w-md rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600 shadow-sm">
          Checking session...
        </section>
      </main>
    );
  }

  return meQuery.isError ? <>{children}</> : null;
}
