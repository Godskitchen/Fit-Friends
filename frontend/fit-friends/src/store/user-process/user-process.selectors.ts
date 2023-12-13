import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { State } from 'src/types/state.type';
import { MyTraining } from 'src/types/training.type';
import { UserInfo } from 'src/types/user.type';


export const getAuthorizationStatus = (state: State): AuthorizationStatus => state[SliceNameSpace.User].authorizationStatus;
export const getAuthCheckedStatus = (state: State): boolean => (getAuthorizationStatus(state)) !== AuthorizationStatus.Unknown;

export const getUserInfo = (state: State): UserInfo | null | undefined => state[SliceNameSpace.User].userInfo;
export const getCoachCertificates = (state: State) => state[SliceNameSpace.User].userInfo?.trainerProfile?.certificates;
export const getProfileStatus = (state: State): boolean => {
  const userInfo = getUserInfo(state);

  return userInfo ? !!(userInfo.trainerProfile || userInfo.userProfile) : false;
};

export const getFormErrors = (state: State) => state[SliceNameSpace.User].formErrors;
export const getNotifications = (state: State) => state[SliceNameSpace.User].notifications;

export const getMyTrainings = (state: State): MyTraining[] | null | undefined => state[SliceNameSpace.User].myTrainingsList;
export const getTotalMyTrainingsCount = (state: State): number => state[SliceNameSpace.User].totalMyTrainingsCount;

export const getFriendList = (state:State) => state[SliceNameSpace.User].friendList;
export const getTotalFriendsCount = (state:State) => state[SliceNameSpace.User].totalFriendsCount;
