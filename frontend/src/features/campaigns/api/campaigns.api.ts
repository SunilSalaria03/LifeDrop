import { AxiosError } from 'axios';
import { axiosClient } from '@/lib/api/axios-client';
import { getApiErrorMessage } from '@/lib/api/error-message';
import { ApiResponse } from '@/types/api';
import {
  BackendCampaign,
  CampaignListParams,
  CampaignListResponse,
  CreateCampaignPayload,
  MyCampaignListParams,
  UpdateCampaignPayload,
} from '../types/campaign.types';

export class ApiRequestError extends Error {
  status?: number;
}

function requireData<T>(response: ApiResponse<T> | T, fallbackMessage: string): T {
  const maybeApi = response as ApiResponse<T>;
  const hasEnvelope =
    typeof maybeApi === 'object' &&
    maybeApi !== null &&
    'success' in maybeApi &&
    'timestamp' in maybeApi;

  if (hasEnvelope) {
    if (!maybeApi.data) {
      throw new Error(fallbackMessage);
    }
    return maybeApi.data;
  }

  if (response === null || response === undefined) {
    throw new Error(fallbackMessage);
  }

  return response as T;
}

function normalizeListParams(params: CampaignListParams | MyCampaignListParams) {
  const normalized: Record<string, unknown> = { ...params };

  for (const [key, value] of Object.entries(normalized)) {
    if (value === undefined || value === null || value === '') {
      delete normalized[key];
    }
  }

  if (normalized.state === 'all') {
    delete normalized.state;
  }
  if (normalized.status === 'all') {
    delete normalized.status;
  }
  if (normalized.type === 'all') {
    delete normalized.type;
  }
  if (normalized.month === 'all') {
    delete normalized.month;
  }

  return normalized;
}

export async function getCampaigns(params: CampaignListParams) {
  try {
    const response = await axiosClient.get<ApiResponse<CampaignListResponse>>(
      '/campaigns',
      { params: normalizeListParams(params) },
    );

    return requireData(response.data, 'Campaign list response was empty.');
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, 'Campaign list API failed. Please try again.'),
    );
  }
}

export async function getCampaignBySlug(slug: string) {
  try {
    const response = await axiosClient.get<ApiResponse<BackendCampaign>>(
      `/campaigns/${slug}`,
    );
    return requireData(response.data, 'Campaign response was empty.');
  } catch (error) {
    if (error instanceof Error && !(error instanceof AxiosError)) {
      throw error;
    }

    const nextError = new ApiRequestError(
      getApiErrorMessage(error, 'Campaign detail API failed. Please try again.'),
    );
    nextError.status = error instanceof AxiosError ? error.response?.status : undefined;
    throw nextError;
  }
}

export async function createCampaign(payload: CreateCampaignPayload) {
  try {
    const response = await axiosClient.post<ApiResponse<BackendCampaign>>(
      '/campaigns',
      payload,
    );
    return requireData(response.data, 'Campaign create response was empty.');
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, 'Campaign could not be created. Please try again.'),
    );
  }
}

export async function getMyCampaigns(params: MyCampaignListParams) {
  try {
    const response = await axiosClient.get<ApiResponse<CampaignListResponse>>(
      '/campaigns/me',
      { params: normalizeListParams(params) },
    );

    return requireData(response.data, 'My campaigns response was empty.');
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, 'My campaigns API failed. Please try again.'),
    );
  }
}

export async function updateCampaign(id: string, payload: UpdateCampaignPayload) {
  try {
    const response = await axiosClient.put<ApiResponse<BackendCampaign>>(
      `/campaigns/${id}`,
      payload,
    );

    return requireData(response.data, 'Campaign update response was empty.');
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, 'Campaign update failed. Please try again.'),
    );
  }
}

export async function getMyCampaignById(id: string) {
  try {
    const response = await axiosClient.get<ApiResponse<BackendCampaign>>(
      `/campaigns/me/${id}`,
    );
    return requireData(response.data, 'Campaign response was empty.');
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, 'Could not load this campaign. Please try again.'),
    );
  }
}

export async function deleteCampaign(id: string) {
  try {
    const response = await axiosClient.delete<ApiResponse<{ id: string; deleted: true }>>(
      `/campaigns/${id}`,
    );
    return requireData(response.data, 'Campaign delete response was empty.');
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, 'Campaign delete failed. Please try again.'),
    );
  }
}
