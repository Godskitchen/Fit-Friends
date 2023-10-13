import {
  FitnessLevel,
  TrainerProfile,
  TrainingType,
} from '@libs/shared/app-types';

export class TrainerProfileEntity implements Omit<TrainerProfile, 'profileId'> {
  fitnessLevel: FitnessLevel;
  trainingType: TrainingType[];
  certificates: string;
  achievements: string;
  readyForWorkout: boolean;

  constructor(profile: Omit<TrainerProfile, 'profileId'>) {
    this.fitnessLevel = profile.fitnessLevel;
    this.trainingType = profile.trainingType;
    this.certificates = profile.certificates;
    this.achievements = profile.achievements;
    this.readyForWorkout = profile.readyForWorkout;
  }

  toObject() {
    return {
      fitnessLevel: this.fitnessLevel,
      trainingType: this.trainingType,
      certificates: this.certificates,
      achievements: this.achievements,
      readyForWorkout: this.readyForWorkout,
    };
  }
}
