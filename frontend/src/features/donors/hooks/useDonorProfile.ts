'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDonorProfile,
  getMyDonorProfile,
  updateDonorProfile,
} from '../api/donors.api';
import { AuthUser } from '@/features/auth/types/auth.types';
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
    onSuccess: (donorProfile, payload) => {
      userStorage.updateUser({
        role: 'donor',
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        bloodGroup: donorProfile.bloodGroup,
        gender: donorProfile.gender as AuthUser['gender'],
        birthDate: donorProfile.birthDate,
        weight: donorProfile.weight,
        lastDonationDate: donorProfile.lastDonationDate,
        showMobile: donorProfile.showMobile,
        smsAlert: donorProfile.smsAlert,
        state: donorProfile.state,
        city: donorProfile.city,
        district: donorProfile.district,
        tehsil: donorProfile.tehsil,
        pincode: donorProfile.pincode,
      });
      queryClient.setQueryData(['donors', 'profile', 'me'], donorProfile);
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      void queryClient.invalidateQueries({ queryKey: ['donors', 'profile', 'me'] });
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
