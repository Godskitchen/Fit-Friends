import { Gender, Role, Location, SkillLevel, Specialisation, TrainingDuration } from './constants';

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  birthday: string;
  location: Location;
  gender: Gender;
  role: Role;
  avatar: string;
}

export type KnownError = {
  error: string;
  message: string[] | string;
  statusCode: number;
}

export type AuthData = {
  email: string;
  password: string;
}

export type UserProfileInfo = {
  skillLevel: SkillLevel;
  specialisations: Specialisation[];
  trainingDuration: TrainingDuration;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
  readyForWorkout: boolean;
}

export type TrainerProfileInfo = {
  skillLevel: SkillLevel;
  specialisations: Specialisation[];
  certificates: string;
  description: string;
  individualTraining: boolean;
}

export type UpdateProfileInfo = {
  name: string;
  aboutInfo: string;
  location: Location;
  gender: Gender;
  avatar?: string | null;
  skillLevel: SkillLevel;
  specialisations: Specialisation[];
  individualTraining: boolean;
}


export type UserInfo = {
  userId: number;
  name: string;
  email: string;
  gender: Gender;
  aboutInfo: string;
  role: Role;
  birthday: string;
  avatar: string;
  backgroundImage: string;
  createdAt: string;
  location: Location;
  userProfile?: UserProfileInfo;
  trainerProfile?: TrainerProfileInfo;
};
