import { Gender, SkillLevel, Specialisation, TrainingDuration } from './constants';

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
