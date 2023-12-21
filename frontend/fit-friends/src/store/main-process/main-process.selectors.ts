import { SliceNameSpace } from 'src/app-constants';
import { FriendsQueryState, MyTrainingsFitersState, TrainingsCatalogFiltersState, UsersCatalogFiltersState } from 'src/types/queries-filters.type';
import { State } from 'src/types/state.type';

export const getMyTrainingsFiltersState = (state: State): MyTrainingsFitersState => state[SliceNameSpace.Main].myTrainingsFilterState;
export const getUsersCatalogFilterState = (state: State): UsersCatalogFiltersState => state[SliceNameSpace.Main].usersCatalogFilterState;
export const getFriendsQueryState = (state: State): FriendsQueryState => state[SliceNameSpace.Main].friendsQueryState;
export const getTrainingsCatalogFilterState = (state: State): TrainingsCatalogFiltersState => state[SliceNameSpace.Main].trainingsCatalogFilterState;

