import { RequestStatus } from '../request-status.enum';
import { User } from './user.interface';

export interface TrainingRequest {
  requestId: number;
  enquirer: User;
  recipient: User;
  status: RequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
