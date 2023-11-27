import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { State } from 'src/types/state.type';
import { UserInfo } from 'src/types/user.type';

export const getAuthorizationStatus = (state: State): AuthorizationStatus => state[SliceNameSpace.User].authorizationStatus;
export const getAuthCheckedStatus = (state: State): boolean => (getAuthorizationStatus(state)) !== AuthorizationStatus.Unknown;

export const getUserInfo = (state: State): UserInfo | null | undefined => state[SliceNameSpace.User].userInfo;
export const getProfileStatus = (state: State): boolean => {
  const userInfo = getUserInfo(state);

  return userInfo ? !!(userInfo.trainerProfile || userInfo.userProfile) : false;
};

export const getFormErrors = (state: State) => state[SliceNameSpace.User].formErrors;
