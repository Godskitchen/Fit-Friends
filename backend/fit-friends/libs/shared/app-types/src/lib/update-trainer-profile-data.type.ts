import { FitnessLevel, TrainingType } from '..';

export type UpdateTrainerProfileData = {
  fitnessLevel?: FitnessLevel;
  trainingType?: TrainingType[];
  certificates?: string;
  achievements?: string;
  readyForWorkout?: boolean;
};
