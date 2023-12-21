import { FitnessLevel, TrainingDuration, TrainingType } from '../..';

export type SpecialTrainingQuery = {
  limit: number;
  trainingType: TrainingType[];
  trainingDuration: TrainingDuration;
  fitnessLevel: FitnessLevel;
};
