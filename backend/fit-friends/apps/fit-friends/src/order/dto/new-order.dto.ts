import { OrderType, PaymentType } from '@libs/shared/app-types';
import { IsEnum, IsInt, IsPositive, Max, Min } from 'class-validator';
import {
  ORDER_TYPE_VALIDATION_MESSAGE,
  PAYMENT_TYPE_VALIDATION_MESSAGE,
  TRAINING_COUNT,
  TRAINING_COUNT_VALIDATION_MESSAGE,
  TRAINING_ID_VALIDATION_MESSAGE,
} from './constants';
import { ApiProperty } from '@nestjs/swagger';

export class NewOrderDto {
  @ApiProperty({
    description: `Тип заказа. Доступные варианты ${Object.values(
      OrderType,
    ).join(',')}`,
    enum: OrderType,
    default: OrderType.Abonement,
  })
  @IsEnum(OrderType, { message: ORDER_TYPE_VALIDATION_MESSAGE })
  orderType: OrderType = OrderType.Abonement;

  @ApiProperty({
    description: 'id тренировки. Целое положительное число',
    example: 2,
  })
  @IsPositive({ message: TRAINING_ID_VALIDATION_MESSAGE })
  @IsInt({ message: TRAINING_ID_VALIDATION_MESSAGE })
  trainingId: number;

  @ApiProperty({
    description: `Количество покупаемых тренировок. Целое положительное число от ${TRAINING_COUNT.MIN} до ${TRAINING_COUNT.MAX}`,
    example: TRAINING_COUNT.MAX,
    minimum: TRAINING_COUNT.MIN,
    maximum: TRAINING_COUNT.MAX,
  })
  @Max(TRAINING_COUNT.MAX, { message: TRAINING_COUNT_VALIDATION_MESSAGE })
  @Min(TRAINING_COUNT.MIN, { message: TRAINING_COUNT_VALIDATION_MESSAGE })
  @IsInt({ message: TRAINING_COUNT_VALIDATION_MESSAGE })
  trainingCount: number;

  @ApiProperty({
    description: `Способ оплаты. Доступные варианты ${Object.values(
      PaymentType,
    ).join(',')}`,
    enum: PaymentType,
    example: PaymentType.Visa,
  })
  @IsEnum(PaymentType, { message: PAYMENT_TYPE_VALIDATION_MESSAGE })
  paymentType: PaymentType;
}
