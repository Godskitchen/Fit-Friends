import { FitnessLevel, TrainingType } from '@libs/shared/app-types';
import { Expose } from 'class-transformer';

export class TrainerProfileRdo {
  @Expose()
  fitnessLevel: FitnessLevel;

  @Expose()
  trainingType: TrainingType[];

  @Expose()
  certificates: string;

  @Expose()
  achievements: string;

  @Expose()
  readyForWorkout: boolean;
}
