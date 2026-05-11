import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthUser } from '@/features/auth/types/auth.types';
import { userStorage } from '@/lib/auth/user-storage';

type TokenRefreshResponse = {
  data?: {
    user?: AuthUser;
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

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const requestUrl = originalRequest?.url ?? '';

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/logout')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    refreshRequest =
      refreshRequest ??
      axiosClient
        .post('/auth/refresh')
        .then((response) => {
          const refreshResponse = response.data as TokenRefreshResponse;
          const nextUser = refreshResponse.data?.user;

          if (!nextUser) {
            throw new Error('Refresh response did not include a user.');
          }

          userStorage.setUser(nextUser);
          return 'refreshed';
        })
        .catch(() => {
          userStorage.clearUser();
          return null;
        })
        .finally(() => {
          refreshRequest = null;
        });

    const refreshed = await refreshRequest;

    if (!refreshed) {
      return Promise.reject(error);
    }

    return axiosClient(originalRequest);
  }
);
