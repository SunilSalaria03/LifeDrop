'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authenticateWithGoogle,
  getMe,
  logout,
  sendPhoneOtp,
  verifyPhoneOtp
} from '../api/auth.api';
import { getRedirectParam, storeAuthTokens } from '../auth.helpers';
import { userStorage } from '@/lib/auth/user-storage';
import { redirectAfterLogin } from '@/lib/auth/redirect-after-login';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const sendOtpMutation = useMutation({
    mutationFn: async ({ phone }: { phone: string }) => sendPhoneOtp({ phone })
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      return verifyPhoneOtp({ phone, otp });
    },
    onSuccess: (authResponse) => {
      storeAuthTokens(authResponse);
      redirectAfterLogin(authResponse, router, getRedirectParam());
    }
  });

  const googleMutation = useMutation({
    mutationFn: async (idToken: string) => authenticateWithGoogle({ idToken }),
    onSuccess: (authResponse) => {
      storeAuthTokens(authResponse);

      if (authResponse.user.phoneVerified) {
        redirectAfterLogin(authResponse, router, getRedirectParam());
      }
    }
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onMutate: () => {
      void queryClient.cancelQueries({ queryKey: ['auth'] });
      void queryClient.cancelQueries({ queryKey: ['donors', 'profile', 'me'] });
    },
    onSettled: () => {
      userStorage.clearUser();
      queryClient.removeQueries({ queryKey: ['auth'] });
      queryClient.removeQueries({ queryKey: ['donors', 'profile', 'me'] });
      router.push('/');
    }
  });

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    retry: false
  });

  useEffect(() => {
    if (meQuery.data) {
      userStorage.setUser(meQuery.data);
    }
  }, [meQuery.data]);

  return {
    sendOtpMutation,
    verifyOtpMutation,
    googleMutation,
    logoutMutation,
    meQuery
  };
}
