import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SliceNameSpace } from 'src/app-constants';
import { MyTrainingsFitersState, UsersCatalogFiltersState } from 'src/types/forms.type';
import { MainProcess } from 'src/types/state.type';

const initialState: MainProcess = {
  myTrainingsFilterState: {},
  usersCatalogFilterState: {}
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
    }
  },
});

export const {setMyTrainingsFiltersStateAction, setUsersCatalogFilterStateAction} = mainProcess.actions;
