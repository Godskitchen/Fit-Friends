import { FitnessLevel, TrainingType } from '@libs/shared/app-types';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TrainerProfileRdo {
  @ApiProperty({ enum: FitnessLevel, example: FitnessLevel.Amateur })
  @Expose()
  fitnessLevel: FitnessLevel;

  @ApiProperty({
    isArray: true,
    enum: TrainingType,
    example: [TrainingType.Aerobics, TrainingType.Boxing],
  })
  @Expose()
  trainingType: TrainingType[];

  @ApiProperty({ example: 'static/path/to/certificate.pdf' })
  @Expose()
  certificates: string;

  @ApiProperty({ example: 'Описание тренерских заслуг' })
  @Expose()
  achievements: string;

  @ApiProperty({ example: true })
  @Expose()
  readyForWorkout: boolean;
}
