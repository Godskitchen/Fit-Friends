import { FitnessLevel, TrainingDuration, TrainingType } from '..';

export type UpdateUserProfileData = {
  fitnessLevel?: FitnessLevel;
  trainingType?: TrainingType[];
  trainingDuration?: TrainingDuration;
  caloriesToBurn?: number;
  dailyCaloriesIntake?: number;
  readyForWorkout?: boolean;
};
