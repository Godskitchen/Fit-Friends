import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MyTrainingsFitersState } from 'src/types/forms.type';
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
export const getTrainingsFiltersState = (state: State): MyTrainingsFitersState => state[SliceNameSpace.User].trainingsFilterState;
export const getTotalTrainingsCount = (state: State): number => state[SliceNameSpace.User].totalTrainingsCount;
