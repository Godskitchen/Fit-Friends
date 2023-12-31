import { Gender, Role, SkillLevel, Specialisation, TrainingDuration, Location, PaymentMethodValue } from './constants';

export type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  birthday: string;
  location: Location;
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

export type ProfileInfoInputs = {
  avatar: FileList | null;
  shouldDeleteAvatar: boolean;
  name: string;
  aboutInfo: string;
  individualTraining: boolean;
  specialisations: Specialisation[];
  location: Location;
  gender: Gender;
  skillLevel: SkillLevel;
}

export type CreateTrainingInputs = {
  title: string;
  description: string;
  specialisation: Specialisation;
  trainingDuration: TrainingDuration;
  skillLevel: SkillLevel;
  gender: Gender;
  caloriesToBurn: number;
  price: number;
  trainingVideo: FileList;
}

export type UpdateTrainingInputs = {
  title: string;
  description: string;
  price: number;
  isSpecialOffer?: boolean;
  video?: FileList;
}

export type CreatePurchaseInputs = {
  trainingId: number;
  trainingCount: number;
  paymentType: PaymentMethodValue;
}

export type CreateReplyInputs = {
  trainingId: number;
  text: string;
  rating: number;
}
