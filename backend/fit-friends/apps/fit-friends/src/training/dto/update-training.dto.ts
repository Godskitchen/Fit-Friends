import {
  FitnessLevel,
  TrainingDuration,
  TrainingType,
  Gender,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import {
  TITLE_LENGTH,
  TITLE_VALIDATION_MESSAGE,
  FITNESS_LEVEL_VALIDATION_MESSAGE,
  TRAINING_DURATION_VALIDATION_MESSAGE,
  TRAINING_TYPE_VALIDATION_MESSAGE,
  PRICE_MIN,
  PRICE_VALIDATION_MESSAGE,
  CALORIES_TO_BURN,
  CALORIES_TO_BURN_VALIDATION_MESSAGE,
  TRAINING_DESCRIPTION_LENGTH,
  DESCRIPTION_VALIDATION_MESSAGE,
  GENDER_VALIDATION_MESSAGE,
  VIDEO_FILE_NAME_PATTERN,
  VIDEO_FILE_VALIDATION_MESSAGE,
  SPECIAL_OFFER_VALIDATION_MESSAGE,
} from './constants';

export class UpdateTrainingDto {
  @Length(TITLE_LENGTH.MIN, TITLE_LENGTH.MAX, {
    message: TITLE_VALIDATION_MESSAGE,
  })
  @IsOptional()
  title?: string;

  @IsEnum(FitnessLevel, { message: FITNESS_LEVEL_VALIDATION_MESSAGE })
  @IsOptional()
  fitnessLevel?: FitnessLevel;

  @IsEnum(TrainingDuration, { message: TRAINING_DURATION_VALIDATION_MESSAGE })
  @IsOptional()
  trainingDuration?: TrainingDuration;

  @IsEnum(TrainingType, { message: TRAINING_TYPE_VALIDATION_MESSAGE })
  @IsOptional()
  trainingType?: TrainingType;

  @Min(PRICE_MIN, { message: PRICE_VALIDATION_MESSAGE })
  @IsInt({ message: PRICE_VALIDATION_MESSAGE })
  @IsOptional()
  price?: number;

  @Max(CALORIES_TO_BURN.MAX, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @Min(CALORIES_TO_BURN.MIN, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @IsInt({ message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @IsOptional()
  caloriesToBurn?: number;

  @Length(TRAINING_DESCRIPTION_LENGTH.MIN, TRAINING_DESCRIPTION_LENGTH.MAX, {
    message: DESCRIPTION_VALIDATION_MESSAGE,
  })
  @IsOptional()
  description?: string;

  @IsEnum(Gender, { message: GENDER_VALIDATION_MESSAGE })
  @IsOptional()
  gender?: Gender;

  @Matches(VIDEO_FILE_NAME_PATTERN, { message: VIDEO_FILE_VALIDATION_MESSAGE })
  @IsOptional()
  video?: string;

  @IsBoolean({ message: SPECIAL_OFFER_VALIDATION_MESSAGE })
  @Type(() => Boolean)
  @IsOptional()
  isSpecialOffer?: boolean;
}
