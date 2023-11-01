import { TrainingType } from '../..';

export type TrainingCard = {
  price: number;
  backgroundImage: string;
  title: string;
  trainingType: TrainingType;
  caloriesToBurn: number;
  description: string;
};
