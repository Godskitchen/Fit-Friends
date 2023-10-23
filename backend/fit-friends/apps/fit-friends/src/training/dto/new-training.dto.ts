import {
  FitnessLevel,
  Gender,
  TrainingDuration,
  TrainingType,
} from '@libs/shared/app-types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import {
  CALORIES_TO_BURN,
  IMAGE_FILE_NAME_PATTERN,
  PRICE_MIN,
  TITLE_LENGTH,
  TRAINING_DESCRIPTION,
  VIDEO_FILE_NAME_PATTERN,
} from './constants';

export class NewTrainingDto {
  @Matches(IMAGE_FILE_NAME_PATTERN)
  backgroundImage: string;

  @IsEnum(FitnessLevel)
  fitnessLevel: FitnessLevel;

  @IsEnum(TrainingDuration)
  trainingDuration: TrainingDuration;

  @IsEnum(TrainingType)
  trainingType: TrainingType;

  @Min(PRICE_MIN)
  @IsInt()
  price: number;

  @Max(CALORIES_TO_BURN.MAX)
  @Min(CALORIES_TO_BURN.MIN)
  @IsInt()
  caloriesToBurn: number;

  @Length(TRAINING_DESCRIPTION.MIN, TRAINING_DESCRIPTION.MAX)
  description: string;

  @IsEnum(Gender)
  gender: Gender;

  @Max(TITLE_LENGTH.MAX)
  @Min(TITLE_LENGTH.MIN)
  @IsInt()
  rating: number;

  @Matches(VIDEO_FILE_NAME_PATTERN)
  video: string;

  @IsBoolean()
  @Type(() => Boolean)
  isSpecialOffer: boolean;
}
