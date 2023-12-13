export enum TrainingRequestStatus {
  Declined = 'Declined',
  Pending = 'Pending',
  Accepted = 'Accepted'
}

export type TrainingRequest = {
  id: string;
  status: TrainingRequestStatus;
}

