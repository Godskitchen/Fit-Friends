import { TrainingRequest, TrainingRequestStatus } from '@libs/shared/app-types';

export class TrainingRequestEntity implements Omit<TrainingRequest, 'id'> {
  senderId: number;
  recepientId: number;
  status: TrainingRequestStatus;

  constructor(request: Omit<TrainingRequest, 'id'>) {
    this.senderId = request.senderId;
    this.recepientId = request.recepientId;
    this.status = request.status;
  }

  toObject() {
    return {
      senderId: this.senderId,
      recepientId: this.recepientId,
      status: this.status,
    };
  }
}
