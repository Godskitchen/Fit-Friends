import { TrainingRdo } from '@app/training';
import { OrderType, PaymentType } from '@libs/shared/app-types';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TRAINING_COUNT } from '../dto/constants';

export class OrderRdo {
  @ApiProperty({ example: '323jkj-3k33j-jj4343' })
  @Expose()
  orderId: string;

  @ApiProperty({ example: OrderType.Abonement, enum: OrderType })
  @Expose()
  orderType: OrderType;

  @ApiProperty({ type: TrainingRdo })
  @Expose()
  @Type(() => TrainingRdo)
  training: TrainingRdo;

  @ApiProperty({ example: 1000 })
  @Expose()
  price: number;

  @ApiProperty({ example: TRAINING_COUNT.MAX })
  @Expose()
  trainingCount: number;

  @ApiProperty({
    description: 'Общая стоимость заказа. Рассчитывается автоматически',
    example: 50000,
  })
  @Expose()
  sum: number;

  @ApiProperty({
    example: PaymentType.Visa,
    enum: PaymentType,
  })
  @Expose()
  paymentType: PaymentType;
}
