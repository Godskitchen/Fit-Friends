import { BaseQuery, TrainingDuration } from '../..';

export type UserTrainingQuery = BaseQuery & {
  rating?: number;
  price?: number[];
  caloriesToBurn?: number[];
  trainingDuration?: TrainingDuration[];
};
