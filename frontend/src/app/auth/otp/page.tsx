'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { stripNextInternalSearchParams } from '@/lib/navigation/safe-url';

export default function OtpPage() {
  const router = useRouter();

  useEffect(() => {
    const params = stripNextInternalSearchParams(
      new URLSearchParams(window.location.search),
    );
    params.set('auth', 'login');
    router.replace(`/?${params.toString()}`);
  }, [router]);

  return null;
}
