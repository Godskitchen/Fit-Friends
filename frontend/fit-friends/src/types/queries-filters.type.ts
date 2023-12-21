export type MyTrainingsFitersState = {
  price?: string;
  caloriesToBurn?: string;
  rating?: string;
  trainingDuration?: string;
  page?: string;
  limit?: string;
}

export type UsersCatalogFiltersState = {
  location?: string;
  trainingType?: string;
  fitnessLevel?: string;
  page?: string;
  limit?: string;
  sort?: string;
  role?: string;
  isReady?: boolean;
}

export type FriendsQueryState = {
  page?: string;
  limit?: string;
}

export type BalanceQueryState = {
  userId: number;
  page?: string;
  limit?: string;
  active?: boolean;
}

export type OrderQueryState = {
  page?: string;
  limit?: string;
  sort?: 'sum' | 'trainingCount';
  sortDirection?: 'asc' | 'desc';
}

export type ReplyQueryState = {
  page?: string;
  limit?: string;
}

export type TrainingsCatalogFiltersState = {
  page?: string;
  limit?: string;
  price?: string;
  caloriesToBurn?: string;
  trainerId?: string;
  trainingType?: string;
  rating?: string;
  sort?: string;
  sortDirection?: string;
  discount?: boolean;
}

export type SpecialTrainingsQueryState = {
  limit: string;
  trainingType: string;
  fitnessLevel: string;
  trainingDuration: string;
}
