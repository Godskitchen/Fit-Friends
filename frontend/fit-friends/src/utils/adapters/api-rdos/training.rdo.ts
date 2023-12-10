import { Gender, SkillLevel, Specialisation, TrainingDuration } from 'src/types/constants';
import { UserRdo } from './auth-user.rdo';

export type TrainingRdo = {
  trainingId: number;
  title: string;
  backgroundImage: string;
  fitnessLevel: SkillLevel;
  trainingDuration: TrainingDuration;
  trainingType: Specialisation;
  price: number;
  caloriesToBurn: number;
  description: string;
  gender: Gender;
  rating: number;
  video: string;
  trainer: UserRdo;
  isSpecialOffer: boolean;
};

export type TrainingListRdo = {
  trainingList: TrainingRdo[];
  totalTrainingsCount: number;
};
