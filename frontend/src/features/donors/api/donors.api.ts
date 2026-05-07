import { AxiosError } from 'axios';
import { axiosClient } from '@/lib/api/axios-client';
import { getApiErrorMessage } from '@/lib/api/error-message';
import { ApiResponse } from '@/types/api';
import {
  DonorDetail,
  DonorProfilePayload,
  DonorSmsAlertPayload,
  DonorSmsAlertResponse,
  DonorSearchFilters,
  DonorSearchResponse,
  MyDonorProfile,
} from '../types/donor.types';

export async function searchDonors(params: DonorSearchFilters) {
  try {
    const response = await axiosClient.get<ApiResponse<DonorSearchResponse>>(
      '/donors/search',
      {
        params,
      },
    );

    return response.data.data?.items ?? [];
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, 'Donor search API failed. Please try again.'),
    );
  }
}

export async function getDonorById(id: string) {
  try {
    const response = await axiosClient.get<ApiResponse<DonorDetail>>(
      `/donors/${id}`,
    ); 
    if (!response.data.data) {
      throw new Error('Donor profile was not found.');
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof Error && !(error instanceof AxiosError)) {
      throw error;
    }

    throw new Error(
      getApiErrorMessage(
        error,
        'Donor profile API failed. Please try again.',
      ),
    );
  }
}

export async function createDonorProfile(payload: DonorProfilePayload) {
  const response = await axiosClient.post<ApiResponse<MyDonorProfile>>(
    '/donors/profile',
    payload,
  );

  if (!response.data.data) {
    throw new Error('Donor profile response was empty.');
  }

  return response.data.data;
}

export async function getMyDonorProfile() {
  const response =
    await axiosClient.get<ApiResponse<MyDonorProfile | null>>(
      '/donors/profile/me',
    );

  return response.data.data ?? null;
}

export async function updateDonorProfile(payload: Partial<DonorProfilePayload>) {
  const response = await axiosClient.put<ApiResponse<MyDonorProfile>>(
    '/donors/profile',
    payload,
  );

  if (!response.data.data) {
    throw new Error('Donor profile response was empty.');
  }

  return response.data.data;
}

export async function sendDonorSmsAlert(payload: DonorSmsAlertPayload) {
  const response = await axiosClient.post<ApiResponse<DonorSmsAlertResponse>>(
    '/blood-requests/send-sms-alert',
    payload,
  );

  const responseData = response.data.data;

  if (!responseData) {
    throw new Error('SMS alert response was empty.');
  }

  if (responseData.smsStatus === 'failed' || responseData.status === 'failed') {
    throw new Error(
      response.data.message ?? 'SMS alert could not be sent. Please try again.',
    );
  }

  return responseData;
}
