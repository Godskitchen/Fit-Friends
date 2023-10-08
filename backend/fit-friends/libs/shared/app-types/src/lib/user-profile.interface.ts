import { FitnessLevel } from './fitness-level.enum';
import { TrainingDuration } from './training-duration';
import { TrainingType } from './training-type.enum';

export interface UserProfile {
  readonly profileId: number;
  fitnessLevel: FitnessLevel;
  trainingType: TrainingType[];
  trainingDuration: TrainingDuration;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
  readyForWorkout: boolean;
}
