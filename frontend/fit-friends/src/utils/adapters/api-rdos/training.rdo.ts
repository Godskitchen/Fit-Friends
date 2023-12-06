import { FitnessLevelToServer, GenderToServer, SpecialisationToServer, TrainingDurationToServer } from '../adaprters-constants';
import { UserRdo } from './auth-user.rdo';

export type TrainingRdo = {
  trainingId: number;
  title: string;
  backgroundImage: string;
  fitnessLevel: FitnessLevelToServer;
  trainingDuration: TrainingDurationToServer;
  trainingType: SpecialisationToServer;
  price: number;
  caloriesToBurn: number;
  description: string;
  gender: GenderToServer;
  rating: number;
  video: string;
  trainer: UserRdo;
  isSpecialOffer: boolean;
};

export type TrainingListRdo = {
  trainingList: TrainingRdo[];
  totalTrainingsCount: number;
};
