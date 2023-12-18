import { TrainingRdo } from './training.rdo';

export type BalanceRdo = {
  balanceId: string;
  training: TrainingRdo;
  remainingAmount: number;
}

export type BalanceListRdo = {
  balanceList: BalanceRdo[];
  totalTrainingsCount: number;
}
