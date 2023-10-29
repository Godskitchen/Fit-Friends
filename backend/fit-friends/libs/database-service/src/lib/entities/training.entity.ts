import {
  FitnessLevel,
  Gender,
  Training,
  TrainingDuration,
  TrainingType,
  User,
} from '@libs/shared/app-types';

export class TrainingEntity implements Omit<Training, 'trainingId' | 'rating'> {
  title: string;
  backgroundImage: string;
  fitnessLevel: FitnessLevel;
  trainingDuration: TrainingDuration;
  trainingType: TrainingType;
  price: number;
  caloriesToBurn: number;
  description: string;
  gender: Gender;
  video: string;
  trainer: User;
  isSpecialOffer: boolean;

  constructor(training: Omit<Training, 'trainingId' | 'rating'>) {
    this.title = training.title;
    this.backgroundImage = training.backgroundImage;
    this.fitnessLevel = training.fitnessLevel;
    this.trainingDuration = training.trainingDuration;
    this.trainingType = training.trainingType;
    this.price = training.price;
    this.caloriesToBurn = training.caloriesToBurn;
    this.description = training.description;
    this.gender = training.gender;
    this.video = training.video;
    this.trainer = training.trainer;
    this.isSpecialOffer = training.isSpecialOffer;
  }

  toObject() {
    return {
      title: this.title,
      backgroundImage: this.backgroundImage,
      fitnessLevel: this.fitnessLevel,
      trainingDuration: this.trainingDuration,
      trainingType: this.trainingType,
      price: this.price,
      caloriesToBurn: this.caloriesToBurn,
      description: this.description,
      gender: this.gender,
      video: this.video,
      trainer: this.trainer,
      isSpecialOffer: this.isSpecialOffer,
    };
  }
}
