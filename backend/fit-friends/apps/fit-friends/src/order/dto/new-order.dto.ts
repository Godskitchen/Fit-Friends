import { OrderType, PaymentType } from '@libs/shared/app-types';
import { IsEnum, IsInt, IsPositive, Max, Min } from 'class-validator';
import {
  ORDER_TYPE_VALIDATION_MESSAGE,
  PAYMENT_TYPE_VALIDATION_MESSAGE,
  TRAINING_COUNT,
  TRAINING_COUNT_VALIDATION_MESSAGE,
  TRAINING_ID_VALIDATION_MESSAGE,
} from './constants';

export class NewOrderDto {
  @IsEnum(OrderType, { message: ORDER_TYPE_VALIDATION_MESSAGE })
  orderType: OrderType = OrderType.Abonement;

  @IsPositive({ message: TRAINING_ID_VALIDATION_MESSAGE })
  @IsInt({ message: TRAINING_ID_VALIDATION_MESSAGE })
  trainingId: number;

  @Max(TRAINING_COUNT.MAX, { message: TRAINING_COUNT_VALIDATION_MESSAGE })
  @Min(TRAINING_COUNT.MIN, { message: TRAINING_COUNT_VALIDATION_MESSAGE })
  @IsInt({ message: TRAINING_COUNT_VALIDATION_MESSAGE })
  trainingCount: number;

  @IsEnum(PaymentType, { message: PAYMENT_TYPE_VALIDATION_MESSAGE })
  paymentType: PaymentType;
}
