import { FitnessLevel, Gender, TrainingDuration, TrainingType } from '../..';
import { User } from './user.interface';

export interface Training {
  readonly trainingId: number;
  title: string;
  backgroundImage: string;
  fitnessLevel: FitnessLevel;
  trainingDuration: TrainingDuration;
  trainingType: TrainingType;
  price: number;
  caloriesToBurn: number;
  description: string;
  gender: Gender;
  rating: number;
  video: string;
  trainer: User;
  isSpecialOffer: boolean;
}
