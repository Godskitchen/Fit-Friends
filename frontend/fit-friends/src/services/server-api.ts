/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, saveToken } from './auth-token';
import { ApiRoute } from 'src/app-constants';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

type RefreshResponse = {
  accessToken: string;
}

export const SERVER_URL = 'http://localhost:4000/api';
export const REQUEST_TIMEOUT = 5000;

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  CONFLICT = 409,
  SERVER_INTERNAL = 500
}

const StatusCodeMapping: Record<number, boolean> = {
  [HttpStatusCode.BAD_REQUEST]: true,
  [HttpStatusCode.UNAUTHORIZED]: true,
  [HttpStatusCode.NOT_FOUND]: true,
  [HttpStatusCode.CONFLICT]: true
};

export const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: SERVER_URL,
    timeout: REQUEST_TIMEOUT,
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = getToken();

      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
  );

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      console.log('from interceptor',error);
      const originalRequest: CustomAxiosRequestConfig = error.config;
      if (error.response?.status === HttpStatusCode.UNAUTHORIZED && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Отправляем запрос на обновление токенов
          const { data } = await axios.get<RefreshResponse>(ApiRoute.RefreshTokens, {baseURL: SERVER_URL, timeout: REQUEST_TIMEOUT, withCredentials: true,});
          saveToken(data.accessToken);
          console.log('получен новый access token');
          // Если запрос на обновление токенов успешен, обновляем токены и повторяем исходный запрос
          // Здесь вы должны реализовать логику обновления токенов в соответствии с вашим API
          // Пример: authService.refreshTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);

          // Повторяем исходный запрос с обновленными токенами
          return api(originalRequest);
        } catch (refreshError) {
          // Если запрос на обновление токенов неуспешен, возвращаем ошибку 401
          return Promise.reject(refreshError);
        }
      }

      // Если ошибка не связана с токенами, просто возвращаем ее
      return Promise.reject(error);
    }
  );

  return api;
};
