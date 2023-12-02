import { SliceNameSpace } from 'src/app-constants';
import { State } from 'src/types/state.type';

export const getDataUploadingStatus = (state: State): boolean => state[SliceNameSpace.Data].isDataUploadingStatus;
