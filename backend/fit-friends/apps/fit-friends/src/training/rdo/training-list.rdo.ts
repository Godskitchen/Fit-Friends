import { Expose, Type } from 'class-transformer';
import { TrainingRdo } from './training.rdo';
import { ApiProperty } from '@nestjs/swagger';

export class TrainingListRdo {
  @ApiProperty({ type: [TrainingRdo] })
  @Expose()
  @Type(() => TrainingRdo)
  trainingList: TrainingRdo[];

  @ApiProperty({ example: 6 })
  @Expose()
  totalTrainingsCount: number;
}
