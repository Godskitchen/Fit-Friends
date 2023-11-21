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

export type AuthDto = {
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


export type UserInfo = {
  userId: number;
  name: string;
  email: string;
  gender: Gender;
  role: Role;
  birthday: string;
  avatar: string;
  backgroundImage: string;
  createdAt: string;
  location: Location;
  userProfile?: UserProfileInfo;
  trainerProfile?: TrainerProfileInfo;
};

export type AuthUserInfo = UserInfo & {accessToken: string}
