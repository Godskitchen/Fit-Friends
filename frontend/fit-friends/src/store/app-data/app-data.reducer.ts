import { createSlice } from '@reduxjs/toolkit';
import { SliceNameSpace } from 'src/app-constants';
import { AppData } from 'src/types/state.type';
import { createTrainingAction } from '../api-actions';

const initialState: AppData = {
  isDataUploadingStatus: false
};

export const appData = createSlice({
  name: SliceNameSpace.Data,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createTrainingAction.fulfilled, (state) => {
        state.isDataUploadingStatus = false;
      })
      .addCase(createTrainingAction.pending, (state) => {
        state.isDataUploadingStatus = true;
      })
      .addCase(createTrainingAction.rejected, (state) => {
        state.isDataUploadingStatus = false;
      });
  }
});
