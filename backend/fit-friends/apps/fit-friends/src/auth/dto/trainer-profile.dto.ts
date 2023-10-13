import { FitnessLevel, TrainingType } from '@libs/shared/app-types';

export default class TrainerProfileDto {
  fitnessLevel: FitnessLevel;
  trainingType: TrainingType[];
  certificates: string;
  achievements: string;
  readyForWorkout: boolean;
}
