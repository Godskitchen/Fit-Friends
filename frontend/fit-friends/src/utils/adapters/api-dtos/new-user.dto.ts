import { Gender, SkillLevel, Specialisation, TrainingDuration } from 'src/types/constants';
import {
  RoleToServer,
  LocationToServer,
} from '../adaprters-constants';

export type NewUserDto = {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  gender: Gender;
  role: RoleToServer;
  aboutInfo?: string;
  birthDate?: string;
  location: (typeof LocationToServer)[keyof typeof LocationToServer];
};

type NewUserProfileDto = {
  fitnessLevel: SkillLevel;
  trainingType: Specialisation[];
  trainingDuration: TrainingDuration;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
  readyForWorkout: boolean;
}

type NewTrainerProfileDto = {
  fitnessLevel: SkillLevel;
  trainingType: Specialisation[];
  certificates: string;
  achievements: string;
  readyForWorkout: boolean;
}

export type NewProfileDto = {
  trainerProfile?: NewTrainerProfileDto;
  userProfile?: NewUserProfileDto;
}
