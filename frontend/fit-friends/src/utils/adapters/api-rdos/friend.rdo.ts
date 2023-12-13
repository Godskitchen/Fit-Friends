import { TrainingRequestStatus } from 'src/types/training-request.type';
import { UserRdo } from './auth-user.rdo';

export type TrainingRequestRdo = {
  id: string;
  status: TrainingRequestStatus;
}

export type FriendRdo = UserRdo & {
  trainingRequestsAsSender: TrainingRequestRdo[];
  trainingRequestsAsRecepient: TrainingRequestRdo[];
}

export type FriendListRdo = {
  friendList: FriendRdo[];
  totalFriendsCount: number;
}
