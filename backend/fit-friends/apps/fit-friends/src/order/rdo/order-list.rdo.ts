import { TrainingRdo } from '@app/training';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class OrderTrainingRdo {
  @ApiProperty({ type: TrainingRdo })
  @Expose()
  @Type(() => TrainingRdo)
  training: TrainingRdo;

  @ApiProperty({ example: 2000 })
  @Expose()
  sum: number;

  @ApiProperty({ example: 6 })
  @Expose()
  trainingCount: number;
}

export class OrderListRdo {
  @ApiProperty({ type: [OrderTrainingRdo] })
  @Expose()
  @Type(() => OrderTrainingRdo)
  orderList: OrderTrainingRdo[];

  @ApiProperty({ example: 6 })
  @Expose()
  totalOrdersCount: number;
}
