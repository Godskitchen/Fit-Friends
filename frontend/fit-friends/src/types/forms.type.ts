import { Gender, Role, SkillLevel, Specialisation, TrainingDuration } from './constants';

export type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  birthday: string;
  location: string;
  gender: Gender;
  role: Role;
  avatar: FileList;
  agreement: boolean;
};

export type LoginInputs = {
  email: string;
  password: string;
}

export type QuestionnaireCoachInputs = {
  specialisations: Specialisation[];
  skillLevel: SkillLevel;
  certificates: FileList;
  description: string;
  individualTraining: boolean;
}

export type QuestionnaireUserInputs = {
  specialisations: Specialisation[];
  skillLevel: SkillLevel;
  trainingDuration: TrainingDuration;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
}
