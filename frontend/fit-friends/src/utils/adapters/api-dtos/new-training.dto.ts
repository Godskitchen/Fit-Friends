import { Gender, SkillLevel, Specialisation, TrainingDuration } from 'src/types/constants';

export type NewTrainingDto = {
  title: string;
  fitnessLevel: SkillLevel;
  trainingDuration: TrainingDuration;
  trainingType: Specialisation;
  price: number;
  caloriesToBurn: number;
  description: string;
  gender: Gender;
  video: string;
  isSpecialOffer: boolean;
};

export type UpdateTrainingDto = Partial<NewTrainingDto>;
