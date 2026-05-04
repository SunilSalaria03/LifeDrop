'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  authenticateWithGoogle,
  getMe,
  logout,
  sendPhoneOtp,
  verifyPhoneOtp
} from '../api/auth.api';
import { AuthResponse } from '../types/auth.types';
import { tokenStorage } from '@/lib/auth/token-storage';

function redirectAfterAuth(authResponse: AuthResponse, router: ReturnType<typeof useRouter>) {
  tokenStorage.setTokens(authResponse.accessToken, authResponse.refreshToken);
  router.push(authResponse.user.isProfileCompleted ? '/dashboard' : '/onboarding');
}

export function useAuth() {
  const router = useRouter();

  const sendOtpMutation = useMutation({
    mutationFn: async ({ phone }: { phone: string }) => sendPhoneOtp({ phone })
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ phone, otp }: { phone: string; otp: string }) => {
      return verifyPhoneOtp({ phone, otp });
    },
    onSuccess: (authResponse) => redirectAfterAuth(authResponse, router)
  });

  const googleMutation = useMutation({
    mutationFn: async (idToken: string) => authenticateWithGoogle({ idToken }),
    onSuccess: (authResponse) => redirectAfterAuth(authResponse, router)
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      tokenStorage.clearTokens();
      router.push('/auth/login');
    }
  });

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled: Boolean(tokenStorage.getAccessToken()),
    retry: false
  });

  return {
    sendOtpMutation,
    verifyOtpMutation,
    googleMutation,
    logoutMutation,
    meQuery
  };
}
