import { SliceNameSpace } from 'src/app-constants';
import { MyTrainingsFitersState, UsersCatalogFiltersState } from 'src/types/forms.type';
import { State } from 'src/types/state.type';

export const getMyTrainingsFiltersState = (state: State): MyTrainingsFitersState => state[SliceNameSpace.Main].myTrainingsFilterState;
export const getUsersCatalogFilterState = (state: State): UsersCatalogFiltersState => state[SliceNameSpace.Main].usersCatalogFilterState;
