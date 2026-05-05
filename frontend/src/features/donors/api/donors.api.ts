import { AxiosError } from 'axios';
import { axiosClient } from '@/lib/api/axios-client';
import { ApiResponse } from '@/types/api';
import {
  DonorDetail,
  DonorSearchFilters,
  DonorSearchResponse,
} from '../types/donor.types';

function getApiErrorMessage(error: unknown, fallback: string) {
  return error instanceof AxiosError
    ? (error.response?.data?.message ?? fallback)
    : fallback;
}

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
