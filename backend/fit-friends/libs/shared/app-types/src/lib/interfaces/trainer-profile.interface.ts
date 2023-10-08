import { FitnessLevel } from '../fitness-level.enum';
import { TrainingType } from '../training-type.enum';

export interface TrainerProfile {
  readonly profileId: number;
  fitnessLevel: FitnessLevel;
  trainingType: TrainingType[];
  certificates: string;
  achievements: string;
  readyForWorkout: boolean;
}
