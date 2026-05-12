'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { stripNextInternalSearchParams } from '@/lib/navigation/safe-url';
import { QueryProviderProps } from './query-provider.types';

function NextInternalUrlCleaner() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (!params.has('_rsc')) {
      return;
    }

    const cleanParams = stripNextInternalSearchParams(params);
    const nextSearch = cleanParams.toString();

    router.replace(
      `${pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`,
      { scroll: false },
    );
  }, [pathname, router]);

  return null;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <NextInternalUrlCleaner />
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}

