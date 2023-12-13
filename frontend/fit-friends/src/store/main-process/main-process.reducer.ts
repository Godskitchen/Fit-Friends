import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SliceNameSpace } from 'src/app-constants';
import { FriendsQueryState, MyTrainingsFitersState, UsersCatalogFiltersState } from 'src/types/forms.type';
import { MainProcess } from 'src/types/state.type';

const initialState: MainProcess = {
  myTrainingsFilterState: {},
  usersCatalogFilterState: {},
  friendsQueryState: {}
};

export const mainProcess = createSlice({
  name: SliceNameSpace.Main,
  initialState,
  reducers: {
    setMyTrainingsFiltersStateAction: (state, {payload}: PayloadAction<MyTrainingsFitersState>) => {
      state.myTrainingsFilterState = payload;
    },
    setUsersCatalogFilterStateAction: (state, {payload}: PayloadAction<UsersCatalogFiltersState>) => {
      state.usersCatalogFilterState = payload;
    },
    setFriendsQueryStateAction: (state, {payload}: PayloadAction<FriendsQueryState>) => {
      state.friendsQueryState = payload;
    }
  },
});

export const {
  setMyTrainingsFiltersStateAction,
  setUsersCatalogFilterStateAction,
  setFriendsQueryStateAction
} = mainProcess.actions;
