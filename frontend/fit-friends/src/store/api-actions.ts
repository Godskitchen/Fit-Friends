/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiRoute, AppRoute } from 'src/app-constants';
import { saveToken, dropToken } from 'src/services/auth-token';
import { HttpStatusCode, REQUEST_TIMEOUT, SERVER_URL, shouldDisplayError } from 'src/services/server-api';
import { Role } from 'src/types/constants';
import { CreateTrainingInputs, MyTrainingsFitersState, ProfileInfoInputs, QuestionnaireCoachInputs, QuestionnaireUserInputs, RegisterInputs, UpdateTrainingInputs, UsersCatalogFiltersState } from 'src/types/forms.type';
import { AppDispatch, State } from 'src/types/state.type';
import { AuthData, KnownError, UserInfo, UserList } from 'src/types/user.type';
import { adaptCoachProfileToServer, adaptNewTrainingToServer, adaptRegisterUserToServer, adaptUpdateProfiletoServer, adaptUpdateTrainingToServer, adaptUserProfileToServer } from 'src/utils/adapters/adapter-to-server';
import { AuthUserRdo, UserListRdo, UserRdo } from 'src/utils/adapters/api-rdos/auth-user.rdo';
import { redirectAction } from './redirect.action';
import { adaptMyTrainingsListToClient, adaptTrainingToClient, adaptUserToClient, adaptUsersListToClient } from 'src/utils/adapters/adapter-to-client';
import { Message } from 'src/types/message.type';
import { Training, TrainingList } from 'src/types/training.type';
import { TrainingListRdo, TrainingRdo } from 'src/utils/adapters/api-rdos/training.rdo';

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
      const questionnaireRoute = adaptedData.role === Role.Trainer ? AppRoute.QuestionnaireCoach : AppRoute.QuestionnaireUser;
      dispatch(redirectAction(questionnaireRoute));
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

      const {data: userData} = await serverApi.post<UserRdo>(
        `${ApiRoute.UserDetails}/${userId}/create`,
        adaptCoachProfileToServer({...coachProfileData, certificates: certificate})
      );

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

export const updateProfileAction = createAsyncThunk<UserInfo, Partial<ProfileInfoInputs> & {userId: number; role: Role}, {extra: AxiosInstance}>(
  'user/updateProfile',
  async(updateData, {extra: serverApi}) => {
    const userId = updateData.userId;
    const role = updateData.role;
    let avatar: string | null | undefined;

    if (updateData.avatar) {
      const image = updateData.avatar[0];
      const form = new FormData();
      form.append('avatar', image, image.name);

      const {data: avatarUrl} = await serverApi.post<string>(
        ApiRoute.UploadAvatar,
        form,
        {headers: {'Content-Type': 'multipart/form-data; boundary=boundary'}},
      );
      avatar = avatarUrl;
    } else {
      avatar = updateData.avatar;
    }
    const { data } = await serverApi.patch<UserRdo>(`${ApiRoute.UserDetails}/${userId}`, adaptUpdateProfiletoServer({...updateData, avatar}, role));
    const adaptedData = adaptUserToClient(data);
    return adaptedData;
  },
);

export const getNotificationsAction = createAsyncThunk<Message[], undefined, {extra: AxiosInstance}> (
  'user/getNotifications',
  async(_arg, {extra: serverApi}) => {
    const {data: notifications} = await serverApi.get<Message[]>(ApiRoute.Notifications);
    return notifications;
  },
);

export const deleteNotificationAction = createAsyncThunk<Message[], string, {extra: AxiosInstance}>(
  'user/deleteNotification',
  async(messageId, {extra: serverApi}) => {
    await serverApi.delete(`${ApiRoute.Notifications}/${messageId}`);
    const {data: notifications} = await serverApi.get<Message[]>(ApiRoute.Notifications);
    return notifications;
  }
);

export const createTrainingAction = createAsyncThunk<void, CreateTrainingInputs,
{
  dispatch: AppDispatch;
  extra: AxiosInstance;
}> (
  'user/createTraining',
  async(newTrainingData, {dispatch, extra: serverApi}) => {
    const trainingVideoFile = newTrainingData.trainingVideo[0];
    const form = new FormData();
    form.append('training_video', trainingVideoFile, trainingVideoFile.name);

    const {data: trainingVideoUrl} = await serverApi.post<string>(
      ApiRoute.UploadTrainingVideo,
      form,
      {headers: {'Content-Type': 'multipart/form-data; boundary=boundary'}},
    );
    await serverApi.post(`${ApiRoute.CreateTraining}`, adaptNewTrainingToServer({...newTrainingData, trainingVideo: trainingVideoUrl}));
    dispatch(redirectAction(AppRoute.CoachAccount));
  }
);


export const getMyTrainingsAction = createAsyncThunk<TrainingList, MyTrainingsFitersState,
{
  extra: AxiosInstance;
}>(
  'user/getMyTrainings',
  async(filtersQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<TrainingListRdo>(ApiRoute.MyTrainings, {params: filtersQuery});
    return adaptMyTrainingsListToClient(data);
  }
);


export const addMoreTrainingsToListAction = createAsyncThunk<TrainingList, MyTrainingsFitersState,
{
  extra: AxiosInstance;
}>(
  'user/addMyTrainingsToList',
  async(filtersQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<TrainingListRdo>(ApiRoute.MyTrainings, {params: filtersQuery});
    return adaptMyTrainingsListToClient(data);
  }
);


export const getTrainingDetailsAction = createAsyncThunk<Training, string,
{
  extra: AxiosInstance;
}>(
  'data/getTrainingDetails',
  async(trainingId, {extra: serverApi}) => {
    const {data} = await serverApi.get<TrainingRdo>(`${ApiRoute.TrainingDetails}/${trainingId}`);
    return adaptTrainingToClient(data);
  }
);

export const updateTrainingAction = createAsyncThunk<Training, Partial<UpdateTrainingInputs> & {trainingId: number},
{
  extra: AxiosInstance;
}>(
  'data/updateTraining',
  async(updateData, {extra: serverApi}) => {
    const {trainingId, video, ...restData} = {...updateData};
    let uploadedVideo: string | undefined;
    if (video) {
      const trainingVideoFile = video[0];
      const form = new FormData();
      form.append('training_video', trainingVideoFile, trainingVideoFile.name);

      const {data: trainingVideoUrl} = await serverApi.post<string>(
        ApiRoute.UploadTrainingVideo,
        form,
        {headers: {'Content-Type': 'multipart/form-data; boundary=boundary'}},
      );
      uploadedVideo = trainingVideoUrl;
    }

    const {data} = await serverApi.patch<TrainingRdo>(`${ApiRoute.UpdateTraining}/${trainingId}`, adaptUpdateTrainingToServer({...restData, trainingVideo: uploadedVideo}));
    return adaptTrainingToClient(data);
  }
);

export const getUsersListAction = createAsyncThunk<UserList, UsersCatalogFiltersState, {
  extra: AxiosInstance;
}>(
  'data/getUsersList',
  async(filtersQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<UserListRdo>(ApiRoute.UsersList, {params: filtersQuery});
    return adaptUsersListToClient(data);
  }
);

export const addMoreUsersToListAction = createAsyncThunk<UserList, UsersCatalogFiltersState, {
  extra: AxiosInstance;
}>(
  'data/addUsersToList',
  async(filtersQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<UserListRdo>(ApiRoute.UsersList, {params: filtersQuery});
    return adaptUsersListToClient(data);
  }
);
