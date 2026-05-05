import { axiosClient } from '@/lib/api/axios-client';
import { ApiResponse } from '@/types/api';

export async function getStates() {
  const response =
    await axiosClient.get<ApiResponse<string[]>>('/locations/states');

  return response.data.data ?? [];
}

export async function getCities(state: string) {
  if (!state) {
    return [];
  }

  const response = await axiosClient.get<ApiResponse<string[]>>(
    '/locations/cities',
    {
      params: {
        state,
      },
    },
  );

  return response.data.data ?? [];
}
