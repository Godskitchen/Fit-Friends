/* eslint-disable no-console */
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
export const REQUEST_TIMEOUT = 50000;

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
          const { data } = await axios.get<RefreshResponse>(ApiRoute.RefreshTokens, {baseURL: SERVER_URL, timeout: REQUEST_TIMEOUT, withCredentials: true,});
          saveToken(data.accessToken);
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};
