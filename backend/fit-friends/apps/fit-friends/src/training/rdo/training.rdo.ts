import { UserRdo } from '@app/user';
import {
  FitnessLevel,
  Gender,
  TrainingDuration,
  TrainingType,
} from '@libs/shared/app-types';
import { Expose, Type } from 'class-transformer';

export class TrainingRdo {
  @Expose()
  trainingId: number;

  @Expose()
  title: string;

  @Expose()
  backgroundImage: string;

  @Expose()
  fitnessLevel: FitnessLevel;

  @Expose()
  trainingDuration: TrainingDuration;

  @Expose()
  trainingType: TrainingType;

  @Expose()
  price: number;

  @Expose()
  caloriesToBurn: number;

  @Expose()
  description: string;

  @Expose()
  gender: Gender;

  @Expose()
  rating: number;

  @Expose()
  video: string;

  @Expose()
  @Type(() => UserRdo)
  trainer: UserRdo;

  @Expose()
  isSpecialOffer: boolean;
}
