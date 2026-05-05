'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendPhoneOtp } from '@/features/auth/api/auth.api';
import { updateProfile, verifyProfilePhone } from '../api/profile.api';

export function useProfile() {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const sendProfileOtpMutation = useMutation({
    mutationFn: sendPhoneOtp,
  });

  const verifyProfilePhoneMutation = useMutation({
    mutationFn: verifyProfilePhone,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  return {
    updateProfileMutation,
    sendProfileOtpMutation,
    verifyProfilePhoneMutation,
  };
}
