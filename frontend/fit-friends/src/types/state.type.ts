import { AuthorizationStatus } from 'src/app-constants';
import { UserInfo } from './user.type';
import { store } from 'src/store';
import { HttpStatusCode } from 'src/services/server-api';
import { Message } from './message.type';
import { Training, TrainingCardType } from './training.type';
import { OrderCardType } from './order.type';
import { Reply } from './reply.type';
import { MyTrainingsFitersState, UsersCatalogFiltersState, FriendsQueryState, TrainingsCatalogFiltersState } from './queries-filters.type';

export type UserProcess = {
  authorizationStatus: AuthorizationStatus;
  myProfileInfo?: UserInfo | null ;
  myTrainingsList?: TrainingCardType[] | null;
  friendList?: UserInfo[] | null;
  totalFriendsCount: number;
  totalMyTrainingsCount: number;
  remainingTrainingAmount: number;
  notifications: Message[];
  orderList?: OrderCardType[] | null;
  totalOrdersCount: number;
  specialTrainingList?: TrainingCardType[] | null;
  formErrors: {
    [key: number]: string | Record<string, string>;
    [HttpStatusCode.CONFLICT]: string;
    [HttpStatusCode.UNAUTHORIZED]: string;
  };
};

export type AppData = {
  dataUploadingStatus: boolean;
  trainingsDownloadingStatus: boolean;
  usersDownloadingStatus: boolean;
  repliesDownloadingStatus: boolean;
  trainingInfo?: Training | null;
  userList?: UserInfo[] | null;
  totalUsersCount: number;
  currentUserDetails?: UserInfo | null;
  trainingList?: TrainingCardType[] | null;
  totalTrainingsCount: number;
  subscriptionStatus?: boolean;
  replyList?: Reply[] | null;
  totalRepliesCount: number;
  readyUsersList?: UserInfo[] | null;
  specialOffersList?: TrainingCardType[] | null;
  loadingError: string;
}

export type MainProcess = {
  myTrainingsFilterState: MyTrainingsFitersState;
  usersCatalogFilterState: UsersCatalogFiltersState;
  friendsQueryState: FriendsQueryState;
  trainingsCatalogFilterState: TrainingsCatalogFiltersState;
}


export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
