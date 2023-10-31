import { BaseQuery } from './base-query.type';

export type OrderQuery = BaseQuery & {
  sort?: SortType;
};

export const SortType = {
  sum: 'sum',
  trainingCount: 'trainingCount',
} as const;

export type SortType = (typeof SortType)[keyof typeof SortType];
