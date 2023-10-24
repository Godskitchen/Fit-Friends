export const MAX_ORDERS_LIMIT = 50;

export const SortType = {
  sum: 'sum',
  trainingCount: 'trainingCount',
} as const;

export type SortType = (typeof SortType)[keyof typeof SortType];

export const SortDirection = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export const DEFAULT_SORT_DIRECTION = 'desc';
