'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDonorProfile,
  getMyDonorProfile,
  updateDonorProfile,
} from '../api/donors.api';
import { AuthUser } from '@/features/auth/types/auth.types';
import { DonorProfilePayload, MyDonorProfile } from '../types/donor.types';
import { UseDonorProfileOptions } from '../donor-hook.types';
import { userStorage } from '@/lib/auth/user-storage';

export function useDonorProfile({
  myDonorProfileEnabled = false,
}: UseDonorProfileOptions = {}) {
  const queryClient = useQueryClient();

  const myDonorProfileQuery = useQuery({
    enabled: myDonorProfileEnabled,
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
      const updatedUser = userStorage.updateUser({
        role: 'donor',
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        isProfileCompleted: true,
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
        location: donorProfile.location,
        donorProfile,
      });
      if (updatedUser) {
        queryClient.setQueryData(['auth', 'me'], updatedUser);
      }
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
    onSuccess: (donorProfile) => {
      const currentUser = userStorage.getUser();

      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          donorProfile,
        };

        userStorage.setUser(updatedUser);
        queryClient.setQueryData(['auth', 'me'], updatedUser);
      }

      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      void queryClient.invalidateQueries({ queryKey: ['donors', 'profile', 'me'] });
    },
  });

  return {
    myDonorProfileQuery,
    createDonorProfileMutation,
    updateDonorProfileMutation,
  };
}
