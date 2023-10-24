import { TrainingRdo } from '@app/training';
import { OrderType, PaymentType } from '@libs/shared/app-types';
import { Expose, Type } from 'class-transformer';

export class OrderRdo {
  @Expose()
  orderId: string;

  @Expose()
  orderType: OrderType;

  @Expose()
  @Type(() => TrainingRdo)
  training: TrainingRdo;

  @Expose()
  price: number;

  @Expose()
  trainingCount: number;

  @Expose()
  sum: number;

  @Expose()
  paymentType: PaymentType;
}
