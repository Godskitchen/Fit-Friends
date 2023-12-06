import { AuthorizationStatus } from 'src/app-constants';
import { UserInfo } from './user.type';
import { store } from 'src/store';
import { HttpStatusCode } from 'src/services/server-api';
import { Message } from './message.type';
import { MyTraining } from './training.type';
import { MyTrainingsFitersState } from './forms.type';

export type UserProcess = {
  authorizationStatus: AuthorizationStatus;
  userInfo?: UserInfo | null ;
  myTrainingsList?: MyTraining[] | null;
  totalTrainingsCount: number;
  trainingsFilterState: MyTrainingsFitersState;
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
}

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
