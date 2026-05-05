import { AxiosError } from 'axios';
import { axiosClient } from '@/lib/api/axios-client';
import { ApiResponse } from '@/types/api';
import { DonorSearchFilters, DonorSearchResponse } from '@/types/donor';

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
    const message =
      error instanceof AxiosError
        ? (error.response?.data?.message ??
          'Donor search API failed. Please try again.')
        : 'Donor search API failed. Please try again.';

    throw new Error(message);
  }
}
