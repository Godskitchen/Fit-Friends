import { Training } from './training.interface';

export interface UserBalance {
  balanceId: number;
  training: Training;
  remainingAmount: number;
}
