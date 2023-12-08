import { createSlice } from '@reduxjs/toolkit';
import { SliceNameSpace } from 'src/app-constants';
import { addMoreTrainingsToListAction, createTrainingAction, getTrainingDetailsAction, updateTrainingAction } from '../api-actions';
import { AppData } from 'src/types/state.type';

const initialState: AppData = {
  dataUploadingStatus: false,
  trainingsDownloadingStatus: false,
  trainingInfo: undefined,
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
      });
  }
});
