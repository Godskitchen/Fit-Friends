import {
  FitnessLevel,
  TrainingDuration,
  TrainingType,
} from '@libs/shared/app-types';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserProfileRdo {
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

  @ApiProperty({ example: 1500 })
  @Expose()
  caloriesToBurn: number;

  @ApiProperty({ example: TrainingDuration.FiftyToEightyMinutes })
  @Expose()
  trainingDuration: TrainingDuration;

  @ApiProperty({ example: 1500 })
  @Expose()
  dailyCaloriesIntake: number;

  @ApiProperty({ example: true })
  @Expose()
  readyForWorkout: boolean;
}
