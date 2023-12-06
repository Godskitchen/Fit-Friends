import { createSlice } from '@reduxjs/toolkit';
import { SliceNameSpace } from 'src/app-constants';
import { addMoreTrainingsToListAction, createTrainingAction } from '../api-actions';
import { AppData } from 'src/types/state.type';

const initialState: AppData = {
  dataUploadingStatus: false,
  trainingsDownloadingStatus: false
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
      });
  }
});
