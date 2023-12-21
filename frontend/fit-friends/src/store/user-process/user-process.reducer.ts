import { createSlice } from '@reduxjs/toolkit';
import { UserProcess } from '../../types/state.type';
import {
  addFriendsToListAction,
  addMyTrainingsToListAction,
  addOrdersToListAction,
  addPurchasesToListAction,
  checkAuthAction,
  createCoachProfileAction,
  createReplyAction,
  createUserProfileAction,
  deleteNotificationAction,
  getFriendListAction,
  getMyTrainingsAction,
  getNotificationsAction,
  getOrderListAction,
  getPurchasesListAction,
  getSpecialTrainingListAction,
  getTrainingAmountAction,
  loginAction,
  registerAction,
  updateProfileAction,
  updateTrainingAmountAction
} from '../api-actions';
import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { HttpStatusCode } from 'src/services/server-api';

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
  myProfileInfo: undefined,
  notifications: [],
  myTrainingsList: undefined,
  totalMyTrainingsCount: 0,
  friendList: undefined,
  totalFriendsCount: 0,
  remainingTrainingAmount: 0,
  orderList: undefined,
  totalOrdersCount: 0,
  specialTrainingList: undefined,
  formErrors: {
    [HttpStatusCode.CONFLICT]: '',
    [HttpStatusCode.UNAUTHORIZED]: ''
  },
};

export const userProcess = createSlice({
  name: SliceNameSpace.User,
  initialState,
  reducers: {
    clearFormErrorsAction: (state) => {
      state.formErrors = {
        [HttpStatusCode.CONFLICT]: '',
        [HttpStatusCode.UNAUTHORIZED]: ''
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerAction.fulfilled, (state, {payload}) => {
        state.myProfileInfo = payload;
        state.authorizationStatus = AuthorizationStatus.Auth;
      })
      .addCase(registerAction.rejected, (state, {payload}) => {
        state.myProfileInfo = null;
        if (payload && payload.statusCode) {
          if (payload.statusCode === HttpStatusCode.CONFLICT) {
            state.formErrors[payload.statusCode] = Array.isArray(payload.message) ? payload.message.join('') : payload.message;
          }
        }
      })
      .addCase(loginAction.fulfilled, (state, {payload}) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.myProfileInfo = payload;
      })
      .addCase(loginAction.rejected, (state, {payload}) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.myProfileInfo = null;
        if (payload && payload.statusCode) {
          if (payload.statusCode === HttpStatusCode.UNAUTHORIZED) {
            state.formErrors[payload.statusCode] = Array.isArray(payload.message) ? payload.message.join('') : payload.message;
          }
        }
      })
      .addCase(checkAuthAction.fulfilled, (state, {payload}) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.myProfileInfo = payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.myProfileInfo = null;
      })
      .addCase(createUserProfileAction.fulfilled, (state, {payload}) => {
        state.myProfileInfo = payload;
      })
      .addCase(createCoachProfileAction.fulfilled, (state, {payload}) => {
        state.myProfileInfo = payload;
      })
      .addCase(updateProfileAction.fulfilled, (state, {payload}) => {
        state.myProfileInfo = payload;
      })
      .addCase(getNotificationsAction.fulfilled, (state, {payload}) => {
        state.notifications = payload;
      })
      .addCase(deleteNotificationAction.fulfilled, (state, {payload}) => {
        state.notifications = payload;
      })
      .addCase(getMyTrainingsAction.fulfilled, (state, {payload}) => {
        state.myTrainingsList = payload.trainingList;
        state.totalMyTrainingsCount = payload.totalTrainingsCount;
      })
      .addCase(getMyTrainingsAction.rejected, (state) => {
        state.myTrainingsList = null;
        state.totalMyTrainingsCount = 0;
      })
      .addCase(addMyTrainingsToListAction.fulfilled, (state, {payload}) => {
        if (state.myTrainingsList) {
          state.myTrainingsList = [...state.myTrainingsList, ...payload.trainingList];
          state.totalMyTrainingsCount = payload.totalTrainingsCount;
        }
      })
      .addCase(getFriendListAction.fulfilled, (state, {payload}) => {
        state.friendList = payload.friendList;
        state.totalFriendsCount = payload.totalFriendsCount;
      })
      .addCase(getFriendListAction.rejected, (state) => {
        state.friendList = null;
        state.totalFriendsCount = 0;
      })
      .addCase(addFriendsToListAction.fulfilled, (state, {payload}) => {
        if (state.friendList) {
          state.friendList = [...state.friendList, ...payload.friendList];
          state.totalFriendsCount = payload.totalFriendsCount;
        }
      })
      .addCase(getTrainingAmountAction.fulfilled, (state, {payload}) => {
        state.remainingTrainingAmount = payload;
      })
      .addCase(getTrainingAmountAction.rejected, (state) => {
        state.remainingTrainingAmount = -1;
      })
      .addCase(updateTrainingAmountAction.fulfilled, (state, {payload}) => {
        state.remainingTrainingAmount = payload;
      })
      .addCase(getPurchasesListAction.fulfilled, (state, {payload}) => {
        state.myTrainingsList = payload.trainingList;
        state.totalMyTrainingsCount = payload.totalTrainingsCount;
      })
      .addCase(getPurchasesListAction.rejected, (state) => {
        state.totalMyTrainingsCount = 0;
        state.myTrainingsList = null;
      })
      .addCase(addPurchasesToListAction.fulfilled, (state, {payload}) => {
        if (state.myTrainingsList) {
          state.myTrainingsList = [...state.myTrainingsList, ...payload.trainingList];
        }
        state.totalMyTrainingsCount = payload.totalTrainingsCount;
      })
      .addCase(addPurchasesToListAction.rejected, (state) => {
        state.remainingTrainingAmount = 0;
      })
      .addCase(getOrderListAction.fulfilled, (state, {payload}) => {
        state.orderList = payload.orderList;
        state.totalOrdersCount = payload.totalOrdersCount;
      })
      .addCase(getOrderListAction.rejected, (state) => {
        state.orderList = null;
        state.totalOrdersCount = 0;
      })
      .addCase(addOrdersToListAction.fulfilled, (state, {payload}) => {
        if (state.orderList) {
          state.orderList = [...state.orderList, ...payload.orderList];
        }
        state.totalOrdersCount = payload.totalOrdersCount;
      })
      .addCase(addOrdersToListAction.rejected, (state) => {
        state.totalOrdersCount = 0;
      })
      .addCase(createReplyAction.rejected, (state, {payload}) => {
        if (payload && payload.statusCode) {
          state.formErrors[payload.statusCode] = Array.isArray(payload.message) ? payload.message.join('') : payload.message;
        }
      })
      .addCase(getSpecialTrainingListAction.fulfilled, (state, {payload}) => {
        state.specialTrainingList = payload;
      })
      .addCase(getSpecialTrainingListAction.rejected, (state) => {
        state.specialTrainingList = null;
      });

  },
});

export const { clearFormErrorsAction } = userProcess.actions;
