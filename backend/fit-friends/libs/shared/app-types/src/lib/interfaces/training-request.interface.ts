import { TrainingRequestStatus } from '../..';

export interface TrainingRequest {
  id: string;
  senderId: number;
  recepientId: number;
  status: TrainingRequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
