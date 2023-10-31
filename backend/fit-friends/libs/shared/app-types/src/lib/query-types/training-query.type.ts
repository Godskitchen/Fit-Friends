import { BaseQuery, TrainingDuration } from '../..';

export type TrainingQuery = BaseQuery & {
  rating?: number;
  price?: number[];
  caloriesToBurn?: number[];
  trainingDuration?: TrainingDuration[];
};
