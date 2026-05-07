'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '../api/auth.api';
import { tokenStorage } from '@/lib/auth/token-storage';

type AuthProtectedGuardProps = {
  children: ReactNode;
};

export function AuthProtectedGuard({ children }: AuthProtectedGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();

    if (!accessToken) {
      router.replace('/?auth=login');
      setIsChecking(false);
      return;
    }

    getMe()
      .then(() => {
        setCanShow(true);
      })
      .catch(() => {
        tokenStorage.clearTokens();
        router.replace('/?auth=login');
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [router]);

  if (isChecking) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10 text-neutral-950">
        <section className="mx-auto max-w-md rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600 shadow-sm">
          Checking session...
        </section>
      </main>
    );
  }

  return canShow ? <>{children}</> : null;
}
