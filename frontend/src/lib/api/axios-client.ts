import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/lib/auth/token-storage';

type TokenRefreshResponse = {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let refreshRequest: Promise<string | null> | null = null;

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = tokenStorage.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const requestUrl = originalRequest?.url ?? '';

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || requestUrl.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      tokenStorage.clearTokens();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    refreshRequest =
      refreshRequest ??
      axiosClient
        .post('/auth/refresh', { refreshToken })
        .then((response) => {
          const refreshResponse = response.data as TokenRefreshResponse;
          const nextAccessToken = refreshResponse.data?.accessToken;
          const nextRefreshToken = refreshResponse.data?.refreshToken;

          if (!nextAccessToken || !nextRefreshToken) {
            throw new Error('Refresh response did not include tokens.');
          }

          tokenStorage.setTokens(nextAccessToken, nextRefreshToken);
          return nextAccessToken;
        })
        .catch(() => {
          tokenStorage.clearTokens();
          return null;
        })
        .finally(() => {
          refreshRequest = null;
        });

    const nextAccessToken = await refreshRequest;

    if (!nextAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
    return axiosClient(originalRequest);
  }
);
