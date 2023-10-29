import { TrainingRequestStatus } from '..';

export type TrainingRequestData = {
  requestId: string;
  status: TrainingRequestStatus;
};
