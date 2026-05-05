import { axiosClient } from '@/lib/api/axios-client';
import { ApiResponse } from '@/types/api';
import {
  ProfileUser,
  UpdateProfilePayload,
  VerifyProfilePhonePayload,
} from '../types/profile.types';

function requireData<T>(response: ApiResponse<T>): T {
  if (!response.data) {
    throw new Error('API response did not include data.');
  }

  return response.data;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const response = await axiosClient.put<ApiResponse<ProfileUser>>(
    '/users/profile',
    payload,
  );

  return requireData(response.data);
}

export async function verifyProfilePhone(payload: VerifyProfilePhonePayload) {
  const response = await axiosClient.post<ApiResponse<ProfileUser>>(
    '/auth/otp/verify-profile-phone',
    payload,
  );

  return requireData(response.data);
}
