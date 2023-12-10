import { Gender, SkillLevel, Specialisation } from 'src/types/constants';
import { LocationToServer } from '../adaprters-constants';

export type UpdateUserDto = {
  name?: string;
  avatar?: string | null;
  gender?: Gender;
  aboutInfo?: string;
  location?: (typeof LocationToServer)[keyof typeof LocationToServer];
  userProfile?: UpdateUserProfileDto;
  trainerProfile?: UpdateTrainerProfileDto;
}

export type UpdateUserProfileDto = {
  fitnessLevel?: SkillLevel;
  trainingType?: Specialisation[];
  readyForWorkout?: boolean;
}

export type UpdateTrainerProfileDto = {
  fitnessLevel?: SkillLevel;
  trainingType?: Specialisation[];
  readyForWorkout?: boolean;
}
