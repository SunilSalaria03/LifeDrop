import { axiosClient } from '@/lib/api/axios-client';
import { ApiResponse } from '@/types/api';
import {
  AuthResponse,
  GoogleAuthPayload,
  PhoneOtpSendPayload,
  PhoneOtpVerifyPayload,
  RefreshTokenPayload
} from '../types/auth.types';

function requireData<T>(response: ApiResponse<T>): T {
  if (!response.data) {
    throw new Error('API response did not include data.');
  }

  return response.data;
}

export async function sendPhoneOtp(payload: PhoneOtpSendPayload) {
  const response = await axiosClient.post<ApiResponse<{ message: string }>>('/auth/otp/send', payload);

  return {
    message: response.data.message ?? 'OTP sent successfully'
  };
}

export async function verifyPhoneOtp(payload: PhoneOtpVerifyPayload) {
  const response = await axiosClient.post<ApiResponse<AuthResponse>>('/auth/otp/verify', payload);

  return requireData(response.data);
}

export async function authenticateWithGoogle(payload: GoogleAuthPayload) {
  const response = await axiosClient.post<ApiResponse<AuthResponse>>('/auth/google', payload);

  return requireData(response.data);
}

export async function refreshAuthToken(payload: RefreshTokenPayload) {
  const response = await axiosClient.post<ApiResponse<AuthResponse>>('/auth/refresh', payload);

  return requireData(response.data);
}

export async function logout() {
  const response = await axiosClient.post<ApiResponse<{ message: string }>>('/auth/logout');

  return response.data.data;
}

export async function getMe() {
  const response = await axiosClient.get<ApiResponse<AuthResponse['user']>>('/auth/me');

  return requireData(response.data);
}
