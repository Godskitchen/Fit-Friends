import { createSlice } from '@reduxjs/toolkit';
import { SliceNameSpace } from 'src/app-constants';
import { addFriendsToListAction, addMoreTrainingsToListAction, addMoreUsersToListAction, checkUserSubscriptionAction, createTrainingAction, getFriendListAction, getTrainingDetailsAction, getUserDetailsAction, getUsersListAction, updateTrainingAction } from '../api-actions';
import { AppData } from 'src/types/state.type';

const initialState: AppData = {
  dataUploadingStatus: false,
  trainingsDownloadingStatus: false,
  usersDownloadingStatus: false,
  trainingInfo: undefined,
  userList: undefined,
  subscriptionStatus: false,
  totalUsersCount: 0,
  currentUserDetails: undefined,
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
      .addCase(addMoreTrainingsToListAction.fulfilled, (state) => {
        state.trainingsDownloadingStatus = false;
      })
      .addCase(addMoreTrainingsToListAction.pending, (state) => {
        state.trainingsDownloadingStatus = true;
      })
      .addCase(addMoreTrainingsToListAction.rejected, (state) => {
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
      .addCase(addMoreUsersToListAction.fulfilled, (state, {payload}) => {
        state.usersDownloadingStatus = false;
        if (state.userList) {
          state.userList = [...state.userList, ...payload.userList];
          state.totalUsersCount = payload.totalUsersCount;
        }
      })
      .addCase(addMoreUsersToListAction.pending, (state) => {
        state.usersDownloadingStatus = true;
      })
      .addCase(addMoreUsersToListAction.rejected, (state) => {
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
      });
  }
});
