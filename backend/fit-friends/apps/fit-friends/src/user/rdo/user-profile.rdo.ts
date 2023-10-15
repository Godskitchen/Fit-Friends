import { FitnessLevel, TrainingType } from '@libs/shared/app-types';
import { Expose } from 'class-transformer';

export class UserProfileRdo {
  @Expose()
  fitnessLevel: FitnessLevel;

  @Expose()
  trainingType: TrainingType[];

  @Expose()
  caloriesToBurn: number;

  @Expose()
  dailyCaloriesIntake: number;

  @Expose()
  readyForWorkout: boolean;
}
