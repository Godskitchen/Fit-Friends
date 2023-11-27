import {
  GenderToServer,
  RoleToServer,
  LocationToServer,
  FitnessLevelToServer,
  SpecialisationToServer,
  TrainingDurationToServer
} from '../adaprters-constants';

export type NewUserDto = {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  gender: GenderToServer;
  role: RoleToServer;
  aboutInfo?: string;
  birthDate?: string;
  location: LocationToServer;
};

type NewUserProfileDto = {
  fitnessLevel: FitnessLevelToServer;
  trainingType: SpecialisationToServer[];
  trainingDuration: TrainingDurationToServer;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
  readyForWorkout: boolean;
}

type NewTrainerProfileDto = {
  fitnessLevel: FitnessLevelToServer;
  trainingType: SpecialisationToServer[];
  certificates: string;
  achievements: string;
  readyForWorkout: boolean;
}

export type NewProfileDto = {
  trainerProfile?: NewTrainerProfileDto;
  userProfile?: NewUserProfileDto;
}
