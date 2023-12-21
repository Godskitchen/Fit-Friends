import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { State } from 'src/types/state.type';
import { TrainingCardType } from 'src/types/training.type';
import { UserInfo } from 'src/types/user.type';


export const getAuthorizationStatus = (state: State): AuthorizationStatus => state[SliceNameSpace.User].authorizationStatus;
export const getAuthCheckedStatus = (state: State): boolean => (getAuthorizationStatus(state)) !== AuthorizationStatus.Unknown;

export const getMyProfileInfo = (state: State): UserInfo | null | undefined => state[SliceNameSpace.User].myProfileInfo;
export const geMyCertificates = (state: State) => state[SliceNameSpace.User].myProfileInfo?.trainerProfile?.certificates;
export const getMyProfileStatus = (state: State): boolean => {
  const userInfo = getMyProfileInfo(state);

  return userInfo ? !!(userInfo.trainerProfile || userInfo.userProfile) : false;
};

export const getFormErrors = (state: State) => state[SliceNameSpace.User].formErrors;
export const getNotifications = (state: State) => state[SliceNameSpace.User].notifications;

export const getMyTrainings = (state: State): TrainingCardType[] | null | undefined => state[SliceNameSpace.User].myTrainingsList;
export const getTotalMyTrainingsCount = (state: State): number => state[SliceNameSpace.User].totalMyTrainingsCount;

export const getFriendList = (state:State) => state[SliceNameSpace.User].friendList;
export const getTotalFriendsCount = (state:State) => state[SliceNameSpace.User].totalFriendsCount;
export const getTrainingAmount = (state:State) => state[SliceNameSpace.User].remainingTrainingAmount;

export const getOrderList = (state:State) => state[SliceNameSpace.User].orderList;
export const getTotalOrdersCount = (state: State) => state[SliceNameSpace.User].totalOrdersCount;

export const getSpecialTrainingsList = (state: State) => state[SliceNameSpace.User].specialTrainingList;
