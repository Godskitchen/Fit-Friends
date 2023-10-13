import { FitnessLevel, TrainingDuration, TrainingType } from '../..';

export interface UserProfile {
  readonly profileId: number;
  fitnessLevel: FitnessLevel;
  trainingType: TrainingType[];
  trainingDuration: TrainingDuration;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
  readyForWorkout: boolean;
}
