import { SliceNameSpace } from 'src/app-constants';
import { State } from 'src/types/state.type';

export const getDataUploadingStatus = (state: State): boolean => state[SliceNameSpace.Data].dataUploadingStatus;
export const getTrainingsDownloadingStatus = (state: State): boolean => state[SliceNameSpace.Data].trainingsDownloadingStatus;
export const getTrainingInfo = (state: State) => state[SliceNameSpace.Data].trainingInfo;

export const getUserList = (state:State) => state[SliceNameSpace.Data].userList;
export const getUsersDownloadingStatus = (state: State): boolean => state[SliceNameSpace.Data].usersDownloadingStatus;
export const getTotalUsersCount = (state: State): number => state[SliceNameSpace.Data].totalUsersCount;

