import { FitnessLevel, Gender, TrainingDuration, TrainingType } from '..';

export type UpdateTrainingData = {
  title?: string;
  backgroundImage?: string;
  fitnessLevel?: FitnessLevel;
  trainingDuration?: TrainingDuration;
  trainingType?: TrainingType;
  price?: number;
  caloriesToBurn?: number;
  description?: string;
  gender?: Gender;
  video?: string;
  isSpecialOffer?: boolean;
};
