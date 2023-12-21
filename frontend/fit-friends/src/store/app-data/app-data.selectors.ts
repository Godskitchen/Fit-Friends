import { SliceNameSpace } from 'src/app-constants';
import { State } from 'src/types/state.type';

export const getDataUploadingStatus = (state: State): boolean => state[SliceNameSpace.Data].dataUploadingStatus;
export const getTrainingsDownloadingStatus = (state: State): boolean => state[SliceNameSpace.Data].trainingsDownloadingStatus;
export const getTrainingInfo = (state: State) => state[SliceNameSpace.Data].trainingInfo;

export const getUserList = (state:State) => state[SliceNameSpace.Data].userList;
export const getUsersDownloadingStatus = (state: State): boolean => state[SliceNameSpace.Data].usersDownloadingStatus;
export const getTotalUsersCount = (state: State): number => state[SliceNameSpace.Data].totalUsersCount;

export const getCurrentUserInfo = (state: State) => state[SliceNameSpace.Data].currentUserDetails;
export const getSubscriptionStatus = (state: State) => state[SliceNameSpace.Data].subscriptionStatus;

export const getTrainingList = (state:State) => state[SliceNameSpace.Data].trainingList;
export const getTotalTrainingsCount = (state: State) => state[SliceNameSpace.Data].totalTrainingsCount;

export const getReplyList = (state:State) => state[SliceNameSpace.Data].replyList;
export const getTotalRepliesCount = (state: State) => state[SliceNameSpace.Data].totalRepliesCount;
export const getRepliesDownLoadingStatus = (state: State) => state[SliceNameSpace.Data].repliesDownloadingStatus;

export const getReadyUsersList = (state: State) => state[SliceNameSpace.Data].readyUsersList;
export const getSpecialOffersList = (state: State) => state[SliceNameSpace.Data].specialOffersList;
