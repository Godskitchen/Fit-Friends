import { FitnessLevel, Location, TrainingType } from '../..';

export type UserFilter = {
  location?: Location[];
  fitnessLevel?: FitnessLevel[];
  trainingType?: TrainingType[];
};

// export type UserFilter = (typeof UserFilter)[keyof typeof UserFilter];
