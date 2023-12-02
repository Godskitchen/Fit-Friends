import { combineReducers } from '@reduxjs/toolkit';
import { SliceNameSpace } from 'src/app-constants';
import { userProcess } from './user-process/user-process.reducer';
import { appData } from './app-data/app-data.reducer';

export const rootReducer = combineReducers({
  [SliceNameSpace.User]: userProcess.reducer,
  [SliceNameSpace.Data]: appData.reducer
});
