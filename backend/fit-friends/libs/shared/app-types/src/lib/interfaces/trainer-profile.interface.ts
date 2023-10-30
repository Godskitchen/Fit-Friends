import { FitnessLevel, TrainingType } from '../..';

export interface TrainerProfile {
  readonly profileId?: number;
  fitnessLevel: FitnessLevel;
  trainingType: TrainingType[];
  certificates: string;
  achievements: string;
  readyForWorkout: boolean;
}
