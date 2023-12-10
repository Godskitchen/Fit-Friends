import { AuthorizationStatus } from 'src/app-constants';
import { UserInfo } from './user.type';
import { store } from 'src/store';
import { HttpStatusCode } from 'src/services/server-api';
import { Message } from './message.type';
import { MyTraining, Training } from './training.type';
import { MyTrainingsFitersState, UsersCatalogFiltersState } from './forms.type';

export type UserProcess = {
  authorizationStatus: AuthorizationStatus;
  userInfo?: UserInfo | null ;
  myTrainingsList?: MyTraining[] | null;
  totalMyTrainingsCount: number;
  notifications: Message[];
  formErrors: {
    [key: number]: string | Record<string, string>;
    [HttpStatusCode.CONFLICT]: string;
    [HttpStatusCode.SERVER_INTERNAL]: string;
    [HttpStatusCode.BAD_REQUEST]: Record<string, string>;
    [HttpStatusCode.UNAUTHORIZED]: string;
  };
};

export type AppData = {
  dataUploadingStatus: boolean;
  trainingsDownloadingStatus: boolean;
  usersDownloadingStatus: boolean;
  trainingInfo?: Training | null;
  userList?: UserInfo[] | null;
  totalUsersCount: number;
}

export type MainProcess = {
  myTrainingsFilterState: MyTrainingsFitersState;
  usersCatalogFilterState: UsersCatalogFiltersState;
}


export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
