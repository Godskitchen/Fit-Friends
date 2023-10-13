import { UserProfile } from '@libs/shared/app-types';
import { FitnessLevel } from '@libs/shared/app-types/lib/fitness-level.enum';
import { TrainingDuration } from '@libs/shared/app-types/lib/training-duration.enum';
import { TrainingType } from '@libs/shared/app-types/lib/training-type.enum';

export class UserProfileEntity implements Omit<UserProfile, 'profileId'> {
  fitnessLevel: FitnessLevel;
  trainingType: TrainingType[];
  trainingDuration: TrainingDuration;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
  readyForWorkout: boolean;
}
