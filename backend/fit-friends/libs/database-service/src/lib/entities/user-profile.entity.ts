import {
  FitnessLevel,
  TrainingDuration,
  TrainingType,
  UserProfile,
} from '@libs/shared/app-types';

export class UserProfileEntity implements Omit<UserProfile, 'profileId'> {
  fitnessLevel: FitnessLevel;
  trainingType: TrainingType[];
  trainingDuration: TrainingDuration;
  caloriesToBurn: number;
  dailyCaloriesIntake: number;
  readyForWorkout: boolean;

  constructor(profile: Omit<UserProfile, 'profileId'>) {
    this.fitnessLevel = profile.fitnessLevel;
    this.trainingType = profile.trainingType;
    this.trainingDuration = profile.trainingDuration;
    this.caloriesToBurn = profile.caloriesToBurn;
    this.dailyCaloriesIntake = profile.dailyCaloriesIntake;
    this.readyForWorkout = profile.readyForWorkout;
  }

  toObject() {
    return {
      fitnessLevel: this.fitnessLevel,
      trainingType: this.trainingType,
      trainingDuration: this.trainingDuration,
      caloriesToBurn: this.caloriesToBurn,
      dailyCaloriesIntake: this.dailyCaloriesIntake,
      readyForWorkout: this.readyForWorkout,
    };
  }
}
