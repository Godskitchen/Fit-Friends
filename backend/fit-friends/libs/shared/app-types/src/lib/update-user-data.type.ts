import {
  FitnessLevel,
  Gender,
  Location,
  TrainingDuration,
  TrainingType,
} from '..';

export type UpdateTrainerProfileData = {
  fitnessLevel?: FitnessLevel;
  trainingType?: TrainingType[];
  certificates?: string;
  achievements?: string;
  readyForWorkout?: boolean;
};

export type UpdateUserProfileData = {
  fitnessLevel?: FitnessLevel;
  trainingType?: TrainingType[];
  trainingDuration?: TrainingDuration;
  caloriesToBurn?: number;
  dailyCaloriesIntake?: number;
  readyForWorkout?: boolean;
};

export type UpdateUserData = {
  name?: string;
  avatarUrl?: string;
  gender?: Gender;
  aboutInfo?: string;
  birthDate?: Date;
  location?: Location;
  backgroundImage?: string;
  userProfile?: UpdateUserProfileData;
  trainerProfile?: UpdateTrainerProfileData;
};
