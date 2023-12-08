import { Gender, SkillLevel, Specialisation, TrainingDuration } from './constants';
import { UserInfo } from './user.type';

export type MyTraining = {
  trainingId: number;
  title: string;
  backgroundImage: string;
  skillLevel: SkillLevel;
  trainingDuration: TrainingDuration;
  specialisation: Specialisation;
  price: number;
  caloriesToBurn: number;
  description: string;
  gender: Gender;
  rating: number;
  isSpecialOffer: boolean;
};

export type Training = MyTraining & {trainer: UserInfo; video: string }

export type TrainingList = {
  trainingList: MyTraining[];
  totalTrainingsCount: number;
}

export type NewTrainingInfo = {
  title: string;
  description: string;
  specialisation: Specialisation;
  trainingDuration: TrainingDuration;
  skillLevel: SkillLevel;
  gender: Gender;
  caloriesToBurn: number;
  price: number;
  trainingVideo: string;
}

export type UpdateTrainingInfo = {
  title?: string;
  description?: string;
  isSpecialOffer?: boolean;
  trainingVideo?: string;
  price?: number;
}
