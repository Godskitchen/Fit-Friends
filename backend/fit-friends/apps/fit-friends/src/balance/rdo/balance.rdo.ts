import { TrainingRdo } from '@app/training';
import { Expose, Type } from 'class-transformer';

export class BalanceRdo {
  @Expose()
  balanceId: string;

  @Expose()
  @Type(() => TrainingRdo)
  training: TrainingRdo;

  @Expose()
  remainingAmount: number;
}
