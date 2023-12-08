import { SliceNameSpace } from 'src/app-constants';
import { State } from 'src/types/state.type';

export const getDataUploadingStatus = (state: State): boolean => state[SliceNameSpace.Data].dataUploadingStatus;
export const getTrainingsDownloadingStatus = (state: State): boolean => state[SliceNameSpace.Data].trainingsDownloadingStatus;
export const getTrainingInfo = (state: State) => state[SliceNameSpace.Data].trainingInfo;
