import { FitnessLevel } from '../fitness-level.enum';
import { Gender } from '../gender.enum';
import { TrainingDuration } from '../training-duration.enum';
import { TrainingType } from '../training-type.enum';
import { User } from './user.interface';

export interface Training {
  readonly trainingId: number;
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
