import { TrainingRdo } from '@app/training';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class BalanceRdo {
  @ApiProperty({ example: 'd32lddl-334-d3434k3-434' })
  @Expose()
  balanceId: string;

  @ApiProperty({ type: TrainingRdo })
  @Expose()
  @Type(() => TrainingRdo)
  training: TrainingRdo;

  @ApiProperty({ example: 5 })
  @Expose()
  remainingAmount: number;
}
