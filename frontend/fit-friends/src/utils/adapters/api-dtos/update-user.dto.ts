import { FitnessLevelToServer, GenderToServer, LocationToServer, SpecialisationToServer } from '../adaprters-constants';

export type UpdateUserDto = {
  name?: string;
  avatar?: string | null;
  gender?: GenderToServer;
  aboutInfo?: string;
  location?: LocationToServer;
  userProfile?: UpdateUserProfileDto;
  trainerProfile?: UpdateTrainerProfileDto;
}

export type UpdateUserProfileDto = {
  fitnessLevel?: FitnessLevelToServer;
  trainingType?: SpecialisationToServer[];
  readyForWorkout?: boolean;
}

export type UpdateTrainerProfileDto = {
  fitnessLevel?: FitnessLevelToServer;
  trainingType?: SpecialisationToServer[];
  readyForWorkout?: boolean;
}
