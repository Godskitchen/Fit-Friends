import { SliceNameSpace } from 'src/app-constants';
import { FriendsQueryState, MyTrainingsFitersState, UsersCatalogFiltersState } from 'src/types/forms.type';
import { State } from 'src/types/state.type';

export const getMyTrainingsFiltersState = (state: State): MyTrainingsFitersState => state[SliceNameSpace.Main].myTrainingsFilterState;
export const getUsersCatalogFilterState = (state: State): UsersCatalogFiltersState => state[SliceNameSpace.Main].usersCatalogFilterState;
export const getFriendsQueryState = (state: State): FriendsQueryState => state[SliceNameSpace.Main].friendsQueryState;
