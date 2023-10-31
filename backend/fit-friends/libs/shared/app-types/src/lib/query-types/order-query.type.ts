import { BaseQuery } from './base-query.type';

export type OrderQuery = BaseQuery & {
  sort?: OrderSortType;
};

export const OrderSortType = {
  sum: 'sum',
  trainingCount: 'trainingCount',
} as const;

export type OrderSortType = (typeof OrderSortType)[keyof typeof OrderSortType];
