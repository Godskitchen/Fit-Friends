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
  CALORIES_TO_BURN_VALIDATION_MESSAGE,
  DESCRIPTION_VALIDATION_MESSAGE,
  FITNESS_LEVEL_VALIDATION_MESSAGE,
  GENDER_VALIDATION_MESSAGE,
  IMAGE_FILE_NAME_PATTERN,
  IMAGE_FILE_VALIDATION_MESSAGE,
  PRICE_MIN,
  PRICE_VALIDATION_MESSAGE,
  SPECIAL_OFFER_VALIDATION_MESSAGE,
  TITLE_LENGTH,
  TITLE_VALIDATION_MESSAGE,
  TRAINING_DESCRIPTION_LENGTH,
  TRAINING_DURATION_VALIDATION_MESSAGE,
  TRAINING_TYPE_VALIDATION_MESSAGE,
  VIDEO_FILE_NAME_PATTERN,
  VIDEO_FILE_VALIDATION_MESSAGE,
} from './constants';

export class NewTrainingDto {
  @Length(TITLE_LENGTH.MIN, TITLE_LENGTH.MAX, {
    message: TITLE_VALIDATION_MESSAGE,
  })
  title: string;

  @Matches(IMAGE_FILE_NAME_PATTERN, { message: IMAGE_FILE_VALIDATION_MESSAGE })
  backgroundImage: string;

  @IsEnum(FitnessLevel, { message: FITNESS_LEVEL_VALIDATION_MESSAGE })
  fitnessLevel: FitnessLevel;

  @IsEnum(TrainingDuration, { message: TRAINING_DURATION_VALIDATION_MESSAGE })
  trainingDuration: TrainingDuration;

  @IsEnum(TrainingType, { message: TRAINING_TYPE_VALIDATION_MESSAGE })
  trainingType: TrainingType;

  @Min(PRICE_MIN, { message: PRICE_VALIDATION_MESSAGE })
  @IsInt({ message: PRICE_VALIDATION_MESSAGE })
  price: number;

  @Max(CALORIES_TO_BURN.MAX, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @Min(CALORIES_TO_BURN.MIN, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @IsInt({ message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  caloriesToBurn: number;

  @Length(TRAINING_DESCRIPTION_LENGTH.MIN, TRAINING_DESCRIPTION_LENGTH.MAX, {
    message: DESCRIPTION_VALIDATION_MESSAGE,
  })
  description: string;

  @IsEnum(Gender, { message: GENDER_VALIDATION_MESSAGE })
  gender: Gender;

  @Matches(VIDEO_FILE_NAME_PATTERN, { message: VIDEO_FILE_VALIDATION_MESSAGE })
  video: string;

  @IsBoolean({ message: SPECIAL_OFFER_VALIDATION_MESSAGE })
  @Type(() => Boolean)
  isSpecialOffer: boolean;
}
