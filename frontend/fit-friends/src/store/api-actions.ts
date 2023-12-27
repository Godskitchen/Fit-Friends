import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiRoute, AppRoute } from 'src/app-constants';
import { saveToken, dropToken } from 'src/services/auth-token';
import { HttpStatusCode, REQUEST_TIMEOUT, SERVER_URL, shouldDisplayError } from 'src/services/server-api';
import { Role } from 'src/types/constants';
import { CreateTrainingInputs, ProfileInfoInputs, QuestionnaireCoachInputs, QuestionnaireUserInputs, RegisterInputs, UpdateTrainingInputs, CreatePurchaseInputs, CreateReplyInputs } from 'src/types/forms.type';
import { AppDispatch } from 'src/types/state.type';
import { AuthData, FriendList, KnownError, UserInfo, UserList } from 'src/types/user.type';
import { adaptCoachProfileToServer, adaptNewTrainingToServer, adaptOrderToServer, adaptRegisterUserToServer, adaptUpdateProfiletoServer, adaptUpdateTrainingToServer, adaptUserProfileToServer } from 'src/utils/adapters/adapter-to-server';
import { AuthUserRdo, FriendListRdo, UserListRdo, UserRdo } from 'src/utils/adapters/api-rdos/user.rdo';
import { redirectAction } from './redirect.action';
import { adaptFriendListToClient, adaptTrainingsListToClient, adaptTrainingToClient, adaptUserToClient, adaptUsersListToClient, adaptTrainingAmountToClient, adaptBalanceListToClient, adaptOrderListToClient, adaptReplyListToClient, adaptReplyToClient, adaptTrainingCardToClient } from 'src/utils/adapters/adapter-to-client';
import { Message } from 'src/types/message.type';
import { Training, TrainingCardType, TrainingList } from 'src/types/training.type';
import { TrainingListRdo, TrainingRdo } from 'src/utils/adapters/api-rdos/training.rdo';
import { TrainingRequest } from 'src/types/training-request.type';
import { Balance } from 'src/types/balance.type';
import { BalanceListRdo, BalanceRdo } from 'src/utils/adapters/api-rdos/balance.rdo';
import { OrderListRdo } from 'src/utils/adapters/api-rdos/order.rdo';
import { OrderList } from 'src/types/order.type';
import { Reply, ReplyList } from 'src/types/reply.type';
import { ReplyListRdo, ReplyRdo } from 'src/utils/adapters/api-rdos/reply.rdo';
import { MyTrainingsFitersState, UsersCatalogFiltersState, FriendsQueryState, TrainingsCatalogFiltersState, BalanceQueryState, OrderQueryState, ReplyQueryState, SpecialTrainingsQueryState } from 'src/types/queries-filters.type';

export const registerAction = createAsyncThunk<
  UserInfo,
  RegisterInputs,
  {
    dispatch: AppDispatch;
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
      return Promise.reject(err);
    }
  }
);

export const createUserProfileAction = createAsyncThunk<
  UserInfo,
  QuestionnaireUserInputs & {userId: number},
  {
    dispatch: AppDispatch;
    extra: AxiosInstance;
  }
>(
  'user/createUserProfile',
  async (userProfileData, { dispatch, extra: serverApi }) => {
    try {
      const userId = userProfileData.userId;
      const {data: userData} = await serverApi.post<UserRdo>(`${ApiRoute.UserDetails}/${userId}/create`, adaptUserProfileToServer({...userProfileData, readyForWorkout: false}));
      const adaptedData = adaptUserToClient(userData);
      dispatch(redirectAction(AppRoute.Main));
      return adaptedData;
    } catch (err) {
      return Promise.reject(err);
    }
  }
);


export const createCoachProfileAction = createAsyncThunk<
  UserInfo,
  QuestionnaireCoachInputs & {userId: number},
  {
    dispatch: AppDispatch;
    extra: AxiosInstance;
  }
>(
  'user/createCoachProfile',
  async (coachProfileData, { dispatch, extra: serverApi }) => {
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
      return adaptedData;
    } catch (err) {
      return Promise.reject(err);
    }
  }
);


export const loginAction = createAsyncThunk<UserInfo, AuthData,
  {
    dispatch: AppDispatch;
    rejectValue: KnownError;
  }>(
    'user/login',
    async (authData, { dispatch, rejectWithValue }) => {
      try {
        const { data } = await axios.post<AuthUserRdo>(ApiRoute.Login, authData, {withCredentials: true, baseURL: SERVER_URL, timeout: REQUEST_TIMEOUT});
        const { accessToken, ...userData } = data;

        saveToken(accessToken);
        dispatch(redirectAction(AppRoute.Main));

        const adaptedData = adaptUserToClient(userData);
        return adaptedData;
      } catch (err) {
        const error = err as AxiosError<KnownError>;
        if (error.response && shouldDisplayError(error.response)) {
          return rejectWithValue(error.response.data);
        }
        return Promise.reject(err);
      }
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

export const updateProfileAction = createAsyncThunk<UserInfo, Partial<ProfileInfoInputs> & {userId: number; role: Role},
  {extra: AxiosInstance}
>(
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
    return adaptTrainingsListToClient(data);
  }
);


export const addMyTrainingsToListAction = createAsyncThunk<TrainingList, MyTrainingsFitersState,
{
  extra: AxiosInstance;
}>(
  'user/addMyTrainingsToList',
  async(filtersQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<TrainingListRdo>(ApiRoute.MyTrainings, {params: filtersQuery});
    return adaptTrainingsListToClient(data);
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

export const addUsersToListAction = createAsyncThunk<UserList, UsersCatalogFiltersState, {
  extra: AxiosInstance;
}>(
  'data/addUsersToList',
  async(filtersQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<UserListRdo>(ApiRoute.UsersList, {params: filtersQuery});
    return adaptUsersListToClient(data);
  }
);

export const getFriendListAction = createAsyncThunk<FriendList, FriendsQueryState, {
  extra: AxiosInstance;
}>(
  'user/getFriendList',
  async(friendsQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<FriendListRdo>(ApiRoute.FriendsList, {params: friendsQuery});
    return adaptFriendListToClient(data);
  }
);

export const addFriendsToListAction = createAsyncThunk<FriendList, FriendsQueryState, {
  extra: AxiosInstance;
}>(
  'user/addFriendsToList',
  async(friendsQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<FriendListRdo>(ApiRoute.FriendsList, {params: friendsQuery});
    return adaptFriendListToClient(data);
  }
);

export const createTrainingRequestStatusAction = createAsyncThunk<void, number, {
  extra: AxiosInstance;
}>(
  'user/createTrainingRequestStatus',
  async(recepientId, {extra: serverApi}) => {
    await serverApi.post(`${ApiRoute.CreateTrainingRequest}/${recepientId}`);
  }
);

export const updateTrainingRequestStatusAction = createAsyncThunk<void, TrainingRequest, {
  extra: AxiosInstance;
}>(
  'user/updateTrainingRequestStatus',
  async(trainingRequest, {extra: serverApi}) => {
    await serverApi.patch(ApiRoute.UpdateTrainingRequest, trainingRequest);
  }
);


export const getUserDetailsAction = createAsyncThunk<UserInfo, string, {
  extra: AxiosInstance;
}>(
  'data/getUserDetails',
  async(userId, {extra: serverApi}) => {
    const {data} = await serverApi.get<UserRdo & {isFriend: boolean}>(`${ApiRoute.UserDetails}/${userId}`);
    return adaptUserToClient(data);
  }
);

export const addUserToFriendsAction = createAsyncThunk<void, number, {
  extra: AxiosInstance;
}>(
  'data/addUserToFriends',
  async(userId, {extra: serverApi}) => {
    await serverApi.patch(`${ApiRoute.FriendsList}/add/${userId}`);
  }
);

export const removeUserFromFriendsAction = createAsyncThunk<void, number, {
  extra: AxiosInstance;
}>(
  'data/removeUserFromFriends',
  async(userId, {extra: serverApi}) => {
    await serverApi.patch(`${ApiRoute.FriendsList}/remove/${userId}`);
  }
);

export const checkUserSubscriptionAction = createAsyncThunk<boolean, number, {
  extra: AxiosInstance;
}>(
  'data/checkUserSubscription',
  async(trainerId, {extra: serverApi}) => {
    const {data: isSubscribed} = await serverApi.get<boolean>(`${ApiRoute.CheckSubscription}/${trainerId}`);
    return isSubscribed;
  }
);

export const subscribeToCoachAction = createAsyncThunk<void, number, {
  extra: AxiosInstance;
}>(
  'data/subscribeToCoach',
  async(trainerId, {extra: serverApi}) => {
    await serverApi.post(`${ApiRoute.AddSubscription}/${trainerId}`);
  }
);

export const unsubscribeToCoachAction = createAsyncThunk<void, number, {
  extra: AxiosInstance;
}>(
  'data/unsubscribeToCoach',
  async(trainerId, {extra: serverApi}) => {
    await serverApi.delete(`${ApiRoute.RemoveSubscription}/${trainerId}`);
  }
);

export const getTrainingListAction = createAsyncThunk<TrainingList, TrainingsCatalogFiltersState, {
  extra: AxiosInstance;
}>(
  'data/getTrainingList',
  async(trainingQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<TrainingListRdo>(ApiRoute.TrainingList, {params: trainingQuery});
    return adaptTrainingsListToClient(data);
  }
);

export const addTrainingsToListAction = createAsyncThunk<TrainingList, TrainingsCatalogFiltersState, {
  extra: AxiosInstance;
}>(
  'data/addTrainingsToList',
  async(trainingQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<TrainingListRdo>(ApiRoute.TrainingList, {params: trainingQuery});
    return adaptTrainingsListToClient(data);
  }
);

export const createOrderAction = createAsyncThunk<void, CreatePurchaseInputs, {
  extra: AxiosInstance;
}>(
  'user/createOrder',
  async(orderData, {extra: serverApi}) => {
    await serverApi.post(ApiRoute.CreateOrder, adaptOrderToServer(orderData));
  }
);

export const getTrainingAmountAction = createAsyncThunk<number, number, {
  extra: AxiosInstance;
}>(
  'user/getTrainingAmount',
  async(trainingId, {extra: serverApi}) => {
    const {data: trainingAmount} = await serverApi.get<number>(`${ApiRoute.MyListBalance}/${trainingId}`);
    return trainingAmount;
  }
);

export const updateTrainingAmountAction = createAsyncThunk<number, Balance, {
  extra: AxiosInstance;
}>(
  'user/updateTrainingAmount',
  async(updateData, {extra: serverApi}) => {
    const {data: updatedBalance} = await serverApi.patch<BalanceRdo>(`${ApiRoute.UpdateBalance}`, updateData);
    return adaptTrainingAmountToClient(updatedBalance);
  }
);

export const getPurchasesListAction = createAsyncThunk<TrainingList, BalanceQueryState, {
  extra: AxiosInstance;
}>(
  'user/getPurchasesList',
  async(query, {extra: serverApi}) => {
    const {data} = await serverApi.get<BalanceListRdo>(`${ApiRoute.MyListBalance}`, {params: query});
    return adaptBalanceListToClient(data);
  }
);

export const addPurchasesToListAction = createAsyncThunk<TrainingList, BalanceQueryState, {
  extra: AxiosInstance;
}>(
  'user/addPurchasesToList',
  async(query, {extra: serverApi}) => {
    const {data} = await serverApi.get<BalanceListRdo>(`${ApiRoute.MyListBalance}`, {params: query});
    return adaptBalanceListToClient(data);
  }
);

export const getOrderListAction = createAsyncThunk<OrderList, OrderQueryState, {
  extra: AxiosInstance;
}>(
  'user/getOrderList',
  async(query, {extra: serverApi}) => {
    const {data} = await serverApi.get<OrderListRdo>(`${ApiRoute.CoachOrdersList}`, {params: query});
    return adaptOrderListToClient(data);
  }
);

export const addOrdersToListAction = createAsyncThunk<OrderList, OrderQueryState, {
  extra: AxiosInstance;
}>(
  'user/addOrdersToList',
  async(query, {extra: serverApi}) => {
    const {data} = await serverApi.get<OrderListRdo>(`${ApiRoute.CoachOrdersList}`, {params: query});
    return adaptOrderListToClient(data);
  }
);

export const getReplyListAction = createAsyncThunk<ReplyList, ReplyQueryState & {trainingId: number}, {
  extra: AxiosInstance;
}>(
  'user/getReplyList',
  async(query, {extra: serverApi}) => {
    const {trainingId, ...restQuery} = query;
    const {data} = await serverApi.get<ReplyListRdo>(`${ApiRoute.ReplyTrainingList}/${trainingId}`, {params: restQuery});
    return adaptReplyListToClient(data);
  }
);

export const addRepliesToListAction = createAsyncThunk<ReplyList, ReplyQueryState & {trainingId: number}, {
  extra: AxiosInstance;
}>(
  'user/addRepliesToList',
  async(query, {extra: serverApi}) => {
    const {trainingId, ...restQuery} = query;
    const {data} = await serverApi.get<ReplyListRdo>(`${ApiRoute.ReplyTrainingList}/${trainingId}`, {params: restQuery});
    return adaptReplyListToClient(data);
  }
);

export const createReplyAction = createAsyncThunk<Reply, CreateReplyInputs, {
  extra: AxiosInstance;
  rejectValue: KnownError;
}>(
  'user/createReply',
  async(newReply, {extra: serverApi, rejectWithValue}) => {
    try {
      const {data} = await serverApi.post<ReplyRdo>(`${ApiRoute.CreateReply}`, newReply);
      return adaptReplyToClient(data);
    } catch (err) {
      const error = err as AxiosError<KnownError>;
      if (error.response && shouldDisplayError(error.response)) {
        return rejectWithValue(error.response.data);
      }
      return Promise.reject(err);
    }
  }
);

export const getSpecialTrainingListAction = createAsyncThunk<TrainingCardType[], SpecialTrainingsQueryState, {
  extra: AxiosInstance;
}>(
  'user/getSpecialTrainingList',
  async(query, {extra: serverApi}) => {
    const {data} = await serverApi.get<TrainingRdo[]>(ApiRoute.SpecialTrainings, {params:query});
    const adaptedData = data.map((training) => adaptTrainingCardToClient(training));
    return adaptedData;
  }
);

export const getSpecialOffersListAction = createAsyncThunk<TrainingList, TrainingsCatalogFiltersState, {
  extra: AxiosInstance;
}>(
  'data/getSpecialOffersList',
  async(query, {extra: serverApi}) => {
    const {data} = await serverApi.get<TrainingListRdo>(ApiRoute.TrainingList, {params:query});
    const adaptedData = adaptTrainingsListToClient(data);
    return adaptedData;
  }
);

export const getReadyUsersListAction = createAsyncThunk<UserList, UsersCatalogFiltersState, {
  extra: AxiosInstance;
}>(
  'data/getReadyUsersList',
  async(filtersQuery, {extra: serverApi}) => {
    const {data} = await serverApi.get<UserListRdo>(ApiRoute.UsersList, {params: filtersQuery});
    return adaptUsersListToClient(data);
  }
);


