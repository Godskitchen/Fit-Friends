import { Transform } from 'class-transformer';
import {
  IsEnum,
  ArrayMinSize,
  ArrayMaxSize,
  isArray,
  arrayMaxSize,
  arrayMinSize,
  Matches,
  Length,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import {
  FITNESS_LEVEL_VALIDATION_MESSAGE,
  TRAINING_TYPE_VALIDATION_MESSAGE,
  TRAINING_TYPE_COUNT,
  TRAINING_TYPE_COUNT_VALIDATION_MESSAGE,
  CERTIFICATES_FILE_NAME_PATTERN,
  CERTIFICATES_VALIDATION_MESSAGE,
  ACHIEVEMENTS,
  ACHIEVEMENTS_VALIDATION_MESSAGE,
  READY_FOR_WORKOUT_VALIDATION_MESSAGE,
} from './constants';
import { FitnessLevel, TrainingType } from '@libs/shared/app-types';

export class UpdateTrainerProfileDto {
  @IsEnum(FitnessLevel, { message: FITNESS_LEVEL_VALIDATION_MESSAGE })
  @IsOptional()
  fitnessLevel?: FitnessLevel;

  @IsEnum(TrainingType, {
    each: true,
    message: TRAINING_TYPE_VALIDATION_MESSAGE,
  })
  @ArrayMinSize(TRAINING_TYPE_COUNT.MIN, {
    message: TRAINING_TYPE_COUNT_VALIDATION_MESSAGE,
  })
  @ArrayMaxSize(TRAINING_TYPE_COUNT.MAX, {
    message: TRAINING_TYPE_COUNT_VALIDATION_MESSAGE,
  })
  @Transform(({ value }) =>
    isArray<string>(value) &&
    arrayMaxSize(value, TRAINING_TYPE_COUNT.MAX) &&
    arrayMinSize(value, TRAINING_TYPE_COUNT.MIN)
      ? Array.from(new Set(value))
      : value,
  )
  @IsOptional()
  trainingType?: TrainingType[];

  @Matches(CERTIFICATES_FILE_NAME_PATTERN, {
    message: CERTIFICATES_VALIDATION_MESSAGE,
  })
  @IsOptional()
  certificates?: string;

  @Length(ACHIEVEMENTS.MIN, ACHIEVEMENTS.MAX, {
    message: ACHIEVEMENTS_VALIDATION_MESSAGE,
  })
  @IsOptional()
  achievements?: string;

  @IsBoolean({ message: READY_FOR_WORKOUT_VALIDATION_MESSAGE })
  @IsOptional()
  readyForWorkout?: boolean;
}
