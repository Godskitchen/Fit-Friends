import { TrainingType, Location, FitnessLevel, Role } from '../..';

export type UserQuery = {
  limit: number;
  page?: number;
  location?: Location[];
  fitnessLevel?: FitnessLevel[];
  trainingType?: TrainingType[];
  sort?: Role;
};
