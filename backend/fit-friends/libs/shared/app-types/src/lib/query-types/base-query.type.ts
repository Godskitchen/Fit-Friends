export type BaseQuery = {
  limit: number;
  page?: number;
  sortDirection?: SortDirection;
};

export const SortDirection = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export const DEFAULT_SORT_DIRECTION = 'desc';
export const MAX_ITEMS_LIMIT = 50;
