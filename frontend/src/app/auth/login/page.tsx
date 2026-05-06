'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('auth', 'login');
    router.replace(`/?${params.toString()}`);
  }, [router]);

  return null;
}
