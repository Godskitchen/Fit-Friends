export type OrderQuery = {
  limit: number;
  page?: number;
  sort?: SortType;
  direction?: SortDirection;
};

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
