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
} from '../api-actions';
import { AppData } from 'src/types/state.type';

const initialState: AppData = {
  dataUploadingStatus: false,
  trainingsDownloadingStatus: false,
  usersDownloadingStatus: false,
  trainingInfo: undefined,
  userList: undefined,
  totalUsersCount: 0,
  currentUserDetails: undefined,
  subscriptionStatus: false,
  trainingList: undefined,
  totalTrainingsCount: 0,
};

export const appData = createSlice({
  name: SliceNameSpace.Data,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
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
      })
      .addCase(getTrainingDetailsAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(getTrainingDetailsAction.rejected, (state) => {
        state.trainingsDownloadingStatus = false;
        state.trainingInfo = null;
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
      })
      .addCase(getUserDetailsAction.pending, (state) => {
        state.usersDownloadingStatus = true;
      })
      .addCase(getUserDetailsAction.rejected, (state) => {
        state.usersDownloadingStatus = false;
        state.currentUserDetails = null;
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
      });
  }
});

