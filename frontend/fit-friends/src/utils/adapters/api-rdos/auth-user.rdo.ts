import { FitnessLevelToServer, GenderToServer, LocationToServer, RoleToServer, SpecialisationToServer, TrainingDurationToServer } from '../adaprters-constants';

export type AuthUserRdo = {
  userId: number;
  name: string;
  email: string;
  avatarUrl: string;
  gender: GenderToServer;
  role: RoleToServer;
  aboutInfo: string;
  birthDate: string;
  location: LocationToServer;
  backgroundImage: string;
  createdAt: string;
  userProfile?: UserProfileRdo;
  trainerProfile?: TrainerProfileRdo;
  accessToken: string;
};

export type UserProfileRdo = {
  fitnessLevel: FitnessLevelToServer;
  trainingType: SpecialisationToServer[];
  trainingDuration: TrainingDurationToServer;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
  readyForWorkout: boolean;
}

export type TrainerProfileRdo = {
  fitnessLevel: FitnessLevelToServer;
  trainingType: SpecialisationToServer[];
  certificates: string;
  achievements: string;
  readyForWorkout: boolean;
}

export type UserRdo = Omit<AuthUserRdo, 'accessToken'>;

