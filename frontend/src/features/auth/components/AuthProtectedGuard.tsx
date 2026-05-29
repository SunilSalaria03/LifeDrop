'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuardProps } from '../auth-component.types';
import { userStorage } from '@/lib/auth/user-storage';
import { useAuth } from '../hooks/useAuth';

export function AuthProtectedGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthLoading, meQuery } = useAuth();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (meQuery.isError) {
      userStorage.clearUser();
      router.replace('/?auth=login');
    }
  }, [isAuthLoading, meQuery.isError, router]);

  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10 text-neutral-950">
        <section className="mx-auto max-w-md rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
          Checking session...
        </section>
      </main>
    );
  }

  return meQuery.data ? <>{children}</> : null;
}
