import { TrainingDuration, TrainingType } from '../..';
import { BaseQuery } from './base-query.type';

export type GeneralTrainingQuery = BaseQuery & {
  trainerId?: number;
  rating?: number[];
  price?: number[];
  caloriesToBurn?: number[];
  trainingDuration?: TrainingDuration[];
  trainingType?: TrainingType[];
  sort?: TrainingSortType;
  discount?: boolean;
};

export const TrainingSortType = {
  price: 'price',
  rating: 'rating',
} as const;

export type TrainingSortType =
  (typeof TrainingSortType)[keyof typeof TrainingSortType];
