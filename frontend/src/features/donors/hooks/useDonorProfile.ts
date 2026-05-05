'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDonorProfile,
  getMyDonorProfile,
  updateDonorProfile,
} from '../api/donors.api';
import { DonorProfilePayload, MyDonorProfile } from '../types/donor.types';
import { userStorage } from '@/lib/auth/user-storage';

export function useDonorProfile() {
  const queryClient = useQueryClient();

  const myDonorProfileQuery = useQuery({
    queryKey: ['donors', 'profile', 'me'],
    queryFn: getMyDonorProfile,
    retry: false,
  });

  const createDonorProfileMutation = useMutation<
    MyDonorProfile,
    Error,
    DonorProfilePayload
  >({
    mutationFn: createDonorProfile,
    onSuccess: () => {
      userStorage.updateUser({ role: 'donor' });
      void queryClient.invalidateQueries({ queryKey: ['donors', 'profile', 'me'] });
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  const updateDonorProfileMutation = useMutation<
    MyDonorProfile,
    Error,
    Partial<DonorProfilePayload>
  >({
    mutationFn: updateDonorProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['donors', 'profile', 'me'] });
    },
  });

  return {
    myDonorProfileQuery,
    createDonorProfileMutation,
    updateDonorProfileMutation,
  };
}
