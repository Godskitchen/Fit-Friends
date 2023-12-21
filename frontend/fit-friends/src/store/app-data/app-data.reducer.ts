import { createSlice } from '@reduxjs/toolkit';
import { SliceNameSpace } from 'src/app-constants';
import {
  addFriendsToListAction,
  addMyTrainingsToListAction,
  addUsersToListAction,
  checkUserSubscriptionAction,
  createTrainingAction, getFriendListAction,
  getTrainingDetailsAction,
  getUserDetailsAction,
  getUsersListAction,
  updateTrainingAction,
  getTrainingListAction,
  addTrainingsToListAction,
  createOrderAction,
  getPurchasesListAction,
  addPurchasesToListAction,
  getOrderListAction,
  addOrdersToListAction,
  getReplyListAction,
  addRepliesToListAction,
  createReplyAction,
  registerAction,
  loginAction,
  getSpecialTrainingListAction,
  getReadyUsersListAction,
  getSpecialOffersListAction,
  checkAuthAction,
} from '../api-actions';
import { AppData } from 'src/types/state.type';
import { LoadError } from 'src/types/constants';

const initialState: AppData = {
  dataUploadingStatus: false,
  trainingsDownloadingStatus: false,
  usersDownloadingStatus: false,
  repliesDownloadingStatus: false,
  trainingInfo: undefined,
  userList: undefined,
  totalUsersCount: 0,
  currentUserDetails: undefined,
  subscriptionStatus: false,
  trainingList: undefined,
  readyUsersList: undefined,
  specialOffersList: undefined,
  totalTrainingsCount: 0,
  replyList: undefined,
  totalRepliesCount: 0,
  loadingError: ''
};

export const appData = createSlice({
  name: SliceNameSpace.Data,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(registerAction.fulfilled, (state) => {
        state.dataUploadingStatus = false;
      })
      .addCase(registerAction.pending, (state) => {
        state.dataUploadingStatus = true;
      })
      .addCase(registerAction.rejected, (state) => {
        state.dataUploadingStatus = false;
      })
      .addCase(loginAction.fulfilled, (state) => {
        state.dataUploadingStatus = false;
      })
      .addCase(loginAction.pending, (state) => {
        state.dataUploadingStatus = true;
      })
      .addCase(loginAction.rejected, (state) => {
        state.dataUploadingStatus = false;
      })
      .addCase(checkAuthAction.fulfilled, (state) => {
        state.loadingError = '';
      })
      .addCase(checkAuthAction.rejected, (state, action) => {
        state.loadingError = (action.error.code === LoadError.NetworkError)
          ? LoadError.NetworkError
          : '';
      })
      .addCase(createTrainingAction.fulfilled, (state) => {
        state.dataUploadingStatus = false;
      })
      .addCase(createTrainingAction.pending, (state) => {
        state.dataUploadingStatus = true;
      })
      .addCase(createTrainingAction.rejected, (state) => {
        state.dataUploadingStatus = false;
      })
      .addCase(addMyTrainingsToListAction.fulfilled, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(addMyTrainingsToListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(addMyTrainingsToListAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(getTrainingDetailsAction.fulfilled, (state, {payload}) => {
        state.trainingsDownloadingStatus = false;
        state.trainingInfo = payload;
        state.loadingError = '';
      })
      .addCase(getTrainingDetailsAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(getTrainingDetailsAction.rejected, (state, action) => {
        state.trainingsDownloadingStatus = false;
        state.trainingInfo = null;
        state.loadingError = (action.error.code === LoadError.NetworkError)
          ? LoadError.NetworkError
          : '';
      })
      .addCase(updateTrainingAction.fulfilled, (state, {payload}) => {
        state.dataUploadingStatus = false;
        state.trainingInfo = payload;
      })
      .addCase(updateTrainingAction.pending, (state) => {
        state.dataUploadingStatus = true;
      })
      .addCase(updateTrainingAction.rejected, (state) => {
        state.dataUploadingStatus = false;
        state.trainingInfo = null;
      })
      .addCase(getUsersListAction.fulfilled, (state, {payload}) => {
        state.usersDownloadingStatus = false;
        state.userList = payload.userList;
        state.totalUsersCount = payload.totalUsersCount;
      })
      .addCase(getUsersListAction.pending, (state) => {
        state.usersDownloadingStatus = true;
      })
      .addCase(getUsersListAction.rejected, (state) => {
        state.usersDownloadingStatus = false;
        state.userList = null;
      })
      .addCase(addUsersToListAction.fulfilled, (state, {payload}) => {
        state.usersDownloadingStatus = false;
        if (state.userList) {
          state.userList = [...state.userList, ...payload.userList];
          state.totalUsersCount = payload.totalUsersCount;
        }
      })
      .addCase(addUsersToListAction.pending, (state) => {
        state.usersDownloadingStatus = true;
      })
      .addCase(addUsersToListAction.rejected, (state) => {
        state.usersDownloadingStatus = false;
      })
      .addCase(getFriendListAction.fulfilled, (state) => {
        state.usersDownloadingStatus = false;
      })
      .addCase(getFriendListAction.pending, (state) => {
        state.usersDownloadingStatus = true;
      })
      .addCase(getFriendListAction.rejected, (state) => {
        state.usersDownloadingStatus = false;
      })
      .addCase(addFriendsToListAction.fulfilled, (state) => {
        state.usersDownloadingStatus = false;
      })
      .addCase(addFriendsToListAction.pending, (state) => {
        state.usersDownloadingStatus = true;
      })
      .addCase(addFriendsToListAction.rejected, (state) => {
        state.usersDownloadingStatus = false;
      })
      .addCase(getUserDetailsAction.fulfilled, (state, { payload }) => {
        state.usersDownloadingStatus = false;
        state.currentUserDetails = payload;
        state.loadingError = '';
      })
      .addCase(getUserDetailsAction.pending, (state) => {
        state.usersDownloadingStatus = true;
      })
      .addCase(getUserDetailsAction.rejected, (state, action) => {
        state.usersDownloadingStatus = false;
        state.currentUserDetails = null;
        state.loadingError = (action.error.code === LoadError.NetworkError)
          ? LoadError.NetworkError
          : '';
      })
      .addCase(checkUserSubscriptionAction.fulfilled, (state, {payload}) => {
        state.subscriptionStatus = payload;
      })
      .addCase(getTrainingListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(getTrainingListAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
        state.trainingList = null;
      })
      .addCase(getTrainingListAction.fulfilled, (state, {payload}) => {
        state.trainingsDownloadingStatus = false;
        state.trainingList = payload.trainingList;
        state.totalTrainingsCount = payload.totalTrainingsCount;
      })
      .addCase(addTrainingsToListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(addTrainingsToListAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
        state.trainingList = null;
      })
      .addCase(addTrainingsToListAction.fulfilled, (state, {payload}) => {
        state.trainingsDownloadingStatus = false;
        if (state.trainingList) {
          state.trainingList = [...state.trainingList, ...payload.trainingList];
        }
        state.totalTrainingsCount = payload.totalTrainingsCount;
      })
      .addCase(createOrderAction.fulfilled, (state) => {
        state.dataUploadingStatus = false;
      })
      .addCase(createOrderAction.pending, (state) => {
        state.dataUploadingStatus = true;
      })
      .addCase(createOrderAction.rejected, (state) => {
        state.dataUploadingStatus = false;
      })
      .addCase(getPurchasesListAction.fulfilled, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(getPurchasesListAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(getPurchasesListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(addPurchasesToListAction.fulfilled, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(addPurchasesToListAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(addPurchasesToListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(getOrderListAction.fulfilled, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(getOrderListAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(getOrderListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(addOrdersToListAction.fulfilled, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(addOrdersToListAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(addOrdersToListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(getReplyListAction.fulfilled, (state, {payload}) => {
        state.repliesDownloadingStatus = false;
        state.replyList = payload.replyList;
        state.totalRepliesCount = payload.totalRepliesCount;
      })
      .addCase(getReplyListAction.rejected, (state) => {
        state.repliesDownloadingStatus = false;
        state.replyList = null;
        state.totalRepliesCount = 0;
      })
      .addCase(getReplyListAction.pending, (state) => {
        state.repliesDownloadingStatus = true;
      })
      .addCase(addRepliesToListAction.fulfilled, (state, {payload}) => {
        state.repliesDownloadingStatus = false;
        if (state.replyList) {
          state.replyList = [...state.replyList, ...payload.replyList];
          state.totalRepliesCount = payload.totalRepliesCount;
        }
      })
      .addCase(addRepliesToListAction.rejected, (state) => {
        state.repliesDownloadingStatus = false;
      })
      .addCase(addRepliesToListAction.pending, (state) => {
        state.repliesDownloadingStatus = true;
      })
      .addCase(createReplyAction.pending, (state) => {
        state.dataUploadingStatus = true;
      })
      .addCase(createReplyAction.rejected, (state) => {
        state.dataUploadingStatus = false;
      })
      .addCase(createReplyAction.fulfilled, (state, {payload}) => {
        state.dataUploadingStatus = false;
        if (state.replyList) {
          state.replyList = [payload, ...state.replyList];
          state.totalRepliesCount = state.totalRepliesCount + 1;
        }
      })
      .addCase(getSpecialTrainingListAction.fulfilled, (state,) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(getSpecialTrainingListAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(getSpecialTrainingListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(getReadyUsersListAction.fulfilled, (state, {payload}) => {
        state.trainingsDownloadingStatus = false;
        state.readyUsersList = payload.userList;
      })
      .addCase(getReadyUsersListAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
        state.readyUsersList = null;
      })
      .addCase(getReadyUsersListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(getSpecialOffersListAction.fulfilled, (state, {payload}) => {
        state.trainingsDownloadingStatus = false;
        state.specialOffersList = payload.trainingList;
      })
      .addCase(getSpecialOffersListAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
        state.specialOffersList = null;
      })
      .addCase(getSpecialOffersListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      });
  }
});

