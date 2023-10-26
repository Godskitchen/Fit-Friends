import { TrainingDuration } from '../..';

export type TrainingQuery = {
  limit: number;
  page?: number;
  rating?: number;
  price?: number[];
  caloriesToBurn?: number[];
  trainingDuration?: TrainingDuration[];
};
