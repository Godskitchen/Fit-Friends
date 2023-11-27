/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiRoute, AppRoute } from 'src/app-constants';
import { saveToken, dropToken } from 'src/services/auth-token';
import { HttpStatusCode, REQUEST_TIMEOUT, SERVER_URL, shouldDisplayError } from 'src/services/server-api';
import { Role } from 'src/types/constants';
import { QuestionnaireCoachInputs, QuestionnaireUserInputs, RegisterInputs } from 'src/types/forms.type';
import { AppDispatch, State } from 'src/types/state.type';
import { AuthData, KnownError, UserInfo } from 'src/types/user.type';
import { adaptCoachProfileToServer, adaptRegisterUserToServer, adaptUserProfileToServer } from 'src/utils/adapters/adapter-to-server';
import { AuthUserRdo, UserRdo } from 'src/utils/adapters/api-rdos/auth-user.rdo';
import { redirectAction } from './redirect.action';
import { adaptUserToClient } from 'src/utils/adapters/adapter-to-client';

export const registerAction = createAsyncThunk<
  UserInfo,
  RegisterInputs,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
    rejectValue: KnownError;
  }
>(
  'user/register',
  async (registerData, { dispatch, extra: serverApi, rejectWithValue }) => {
    try {
      const avatarImage = registerData.avatar[0];
      const form = new FormData();
      form.append('avatar', avatarImage, avatarImage.name);

      const {data: avatar} = await serverApi.post<string>(
        ApiRoute.UploadAvatar,
        form,
        {headers: {'Content-Type': 'multipart/form-data; boundary=boundary'}},
      );
      const {data} = await serverApi.post<AuthUserRdo>(ApiRoute.Register, adaptRegisterUserToServer({...registerData, avatar}));
      const {accessToken, ...userData} = data;
      saveToken(accessToken);
      const adaptedData = adaptUserToClient(userData);
      const questionnaireRoute = adaptedData.role === Role.Coach ? AppRoute.QuestionnaireCoach : AppRoute.QuestionnaireUser;
      dispatch(redirectAction(questionnaireRoute));
      console.log('userData', userData);
      return adaptedData;
    } catch (err) {
      const error = err as AxiosError<KnownError>;
      if (error.response && shouldDisplayError(error.response)) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const createUserProfileAction = createAsyncThunk<
  UserInfo,
  QuestionnaireUserInputs & {userId: number},
  {
    dispatch: AppDispatch;
    extra: AxiosInstance;
    rejectValue: KnownError;
  }
>(
  'user/createUserProfile',
  async (userProfileData, { dispatch, extra: serverApi, rejectWithValue }) => {
    try {
      const userId = userProfileData.userId;
      const {data: userData} = await serverApi.post<UserRdo>(`${ApiRoute.UserDetails}/${userId}/create`, adaptUserProfileToServer({...userProfileData, readyForWorkout: false}));
      const adaptedData = adaptUserToClient(userData);
      dispatch(redirectAction(AppRoute.Main));
      console.log('userData', userData);
      return adaptedData;
    } catch (err) {
      const error = err as AxiosError<KnownError>;
      if (error.response && shouldDisplayError(error.response)) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);


export const createCoachProfileAction = createAsyncThunk<
  UserInfo,
  QuestionnaireCoachInputs & {userId: number},
  {
    dispatch: AppDispatch;
    extra: AxiosInstance;
    rejectValue: KnownError;
  }
>(
  'user/createCoachProfile',
  async (coachProfileData, { dispatch, extra: serverApi, rejectWithValue }) => {
    try {
      const userId = coachProfileData.userId;
      const certificateFile = coachProfileData.certificates[0];
      const form = new FormData();
      form.append('certificate', certificateFile, certificateFile.name);

      const {data: certificate} = await serverApi.post<string>(
        ApiRoute.UploadCertificate,
        form,
        {headers: {'Content-Type': 'multipart/form-data; boundary=boundary'}},
      );

      const {data: userData} = await serverApi.post<UserRdo>(`${ApiRoute.UserDetails}/${userId}/create`, adaptCoachProfileToServer({...coachProfileData, certificates: certificate}));
      const adaptedData = adaptUserToClient(userData);
      dispatch(redirectAction(AppRoute.Main));
      console.log('userData', userData);
      return adaptedData;
    } catch (err) {
      const error = err as AxiosError<KnownError>;
      if (error.response && shouldDisplayError(error.response)) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);


export const loginAction = createAsyncThunk<UserInfo, AuthData,
  {
    dispatch: AppDispatch;
  }>(
    'user/login',
    async (authData, { dispatch }) => {
      const { data } = await axios.post<AuthUserRdo>(ApiRoute.Login, authData, {withCredentials: true, baseURL: SERVER_URL, timeout: REQUEST_TIMEOUT});
      const { accessToken, ...userData } = data;

      saveToken(accessToken);
      dispatch(redirectAction(AppRoute.Main));

      const adaptedData = adaptUserToClient(userData);
      return adaptedData;
    },
  );

export const checkAuthAction = createAsyncThunk<UserInfo, undefined, {extra: AxiosInstance}>(
  'user/checkAuth',
  async (_arg, { extra: serverApi }) => {
    try {
      const { data } = await serverApi.get<AuthUserRdo>(ApiRoute.CheckAuth);
      const {accessToken, ...userData} = data;
      const adaptedData = adaptUserToClient(userData);
      return adaptedData;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpStatusCode.UNAUTHORIZED) {
        dropToken();
      }

      return Promise.reject(error);
    }
  },
);

