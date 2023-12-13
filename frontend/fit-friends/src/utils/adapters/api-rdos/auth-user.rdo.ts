import { Gender, Location, Role, SkillLevel, Specialisation, TrainingDuration } from 'src/types/constants';

export type AuthUserRdo = {
  userId: number;
  name: string;
  email: string;
  avatarUrl: string;
  gender: Gender;
  role: keyof typeof Role;
  aboutInfo: string;
  birthDate: string;
  location: keyof typeof Location;
  backgroundImage: string;
  createdAt: string;
  userProfile?: UserProfileRdo;
  trainerProfile?: TrainerProfileRdo;
  accessToken: string;
};

export type UserRdo = Omit<AuthUserRdo, 'accessToken'>;

export type UserProfileRdo = {
  fitnessLevel: SkillLevel;
  trainingType: Specialisation[];
  trainingDuration: TrainingDuration;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
  readyForWorkout: boolean;
}

export type TrainerProfileRdo = {
  fitnessLevel: SkillLevel;
  trainingType: Specialisation[];
  certificates: string;
  achievements: string;
  readyForWorkout: boolean;
}

export type UserListRdo = {
  userList: UserRdo[];
  totalUsersCount: number;
}

