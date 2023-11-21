/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from './auth-token';

const SERVER_URL = 'http://localhost:4000/api';
const REQUEST_TIMEOUT = 5000;

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
    (response) => {
      console.log('response', response);
      return response;
    },
    (error) => {
      console.log('from interceptor',error);
      return Promise.reject(error);
    }
  );

  return api;
};
