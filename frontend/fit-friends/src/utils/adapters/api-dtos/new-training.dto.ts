import { FitnessLevelToServer, GenderToServer, SpecialisationToServer, TrainingDurationToServer } from '../adaprters-constants';

export type NewTrainingDto = {
  title: string;
  fitnessLevel: FitnessLevelToServer;
  trainingDuration: TrainingDurationToServer;
  trainingType: SpecialisationToServer;
  price: number;
  caloriesToBurn: number;
  description: string;
  gender: GenderToServer;
  video: string;
  isSpecialOffer: boolean;
};

export type UpdateTrainingDto = Partial<NewTrainingDto>;
