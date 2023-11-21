/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance, AxiosError } from 'axios';
import { ApiRoute, AppRoute } from 'src/app-constants';
import { saveToken, dropToken } from 'src/services/auth-token';
import { HttpStatusCode, shouldDisplayError } from 'src/services/server-api';
import { Role } from 'src/types/constants';
import { QuestionnaireCoachInputs, QuestionnaireUserInputs, RegisterInputs } from 'src/types/forms.type';
import { AppDispatch, State } from 'src/types/state.type';
import { AuthDto, AuthUserInfo, KnownError, UserInfo } from 'src/types/user.type';
import { adaptNewUserToClient } from 'src/utils/adapters/adapter-to-client';
import { adaptCoachProfileToServer, adaptRegisterUserToServer, adaptUserProfileToServer } from 'src/utils/adapters/adapter-to-server';
import { AuthUserRdo, UserRdo } from 'src/utils/adapters/api-rdos/auth-user.rdo';
import { redirectAction } from './redirect.action';

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
      const adaptedData = adaptNewUserToClient(userData);
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
  QuestionnaireUserInputs,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
    rejectValue: KnownError;
  }
>(
  'user/createUserProfile',
  async (userProfileData, { dispatch, extra: serverApi, rejectWithValue, getState }) => {
    try {
      const userId = getState().USER.userInfo?.userId;
      if (!userId) {
        return Promise.reject('Пользователь не найден');
      }

      const {data: userData} = await serverApi.post<UserRdo>(`${ApiRoute.UserDetails}/${userId}/create`, adaptUserProfileToServer({...userProfileData, readyForWorkout: false}));
      const adaptedData = adaptNewUserToClient(userData);
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
  QuestionnaireCoachInputs,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
    rejectValue: KnownError;
  }
>(
  'user/createCoachProfile',
  async (coachProfileData, { dispatch, extra: serverApi, rejectWithValue, getState }) => {
    try {
      const userId = getState().USER.userInfo?.userId;
      if (!userId) {
        return Promise.reject('Пользователь не найден');
      }

      const certificateFile = coachProfileData.certificates[0];
      const form = new FormData();
      form.append('certificate', certificateFile, certificateFile.name);

      const {data: certificate} = await serverApi.post<string>(
        ApiRoute.UploadCertificate,
        form,
        {headers: {'Content-Type': 'multipart/form-data; boundary=boundary'}},
      );

      const {data: userData} = await serverApi.post<UserRdo>(`${ApiRoute.UserDetails}/${userId}/create`, adaptCoachProfileToServer({...coachProfileData, certificates: certificate}));
      const adaptedData = adaptNewUserToClient(userData);
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


export const loginAction = createAsyncThunk<UserInfo, AuthDto,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }>(
    'user/login',
    async (authDto, { dispatch, extra: serverApi }) => {
      const { data } = await serverApi.post<AuthUserInfo>(ApiRoute.Login, authDto);
      const { accessToken, ...userInfo } = data;

      saveToken(accessToken);
      // dispatch(redirect(AppRoute.Main));

      return userInfo;
    },
  );

export const checkAuthAction = createAsyncThunk<UserInfo, undefined, {extra: AxiosInstance}>(
  'user/checkAuth',
  async (_arg, { extra: serverApi }) => {
    try {
      const { data: userInfo } = await serverApi.get<UserInfo>(ApiRoute.Login);
      return userInfo;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpStatusCode.UNAUTHORIZED) {
        dropToken();
      }

      return Promise.reject(error);
    }
  },

  // export const checkFirstAuthAction = createAsyncThunk<UserInfo, undefined, {extra: AxiosInstance}>(
//   'user/checkFirstAuth',
//   async (_arg, { extra: serverApi }) => {
//     const { data: userInfo } = await serverApi.get<UserInfo>(ApiRoute.Login, {
//       ignoreAuthError: true,
//     } as CustomAxiosRequestConfig);
//     return userInfo;
//   },
// );
);

