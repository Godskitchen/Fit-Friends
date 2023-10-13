import {
  FitnessLevel,
  TrainingDuration,
  TrainingType,
} from '@libs/shared/app-types';

export default class UserProfileDto {
  fitnessLevel: FitnessLevel;
  trainingType: TrainingType[];
  trainingDuration: TrainingDuration;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
  readyForWorkout: boolean;
}
