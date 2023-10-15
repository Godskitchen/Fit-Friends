import { FitnessLevel, TrainingType } from '@libs/shared/app-types';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  Length,
  Matches,
  arrayMaxSize,
  arrayMinSize,
  isArray,
} from 'class-validator';
import {
  ACHIEVEMENTS,
  ACHIEVEMENTS_VALIDATION_MESSAGE,
  CERTIFICATES_FILE_NAME_PATTERN,
  CERTIFICATES_VALIDATION_MESSAGE,
  FITNESS_LEVEL_VALIDATION_MESSAGE,
  READY_FOR_WORKOUT_VALIDATION_MESSAGE,
  TRAINING_TYPE_COUNT,
  TRAINING_TYPE_COUNT_VALIDATION_MESSAGE,
  TRAINING_TYPE_VALIDATION_MESSAGE,
} from './constants';
import { Transform } from 'class-transformer';

export class TrainerProfileDto {
  @IsEnum(FitnessLevel, { message: FITNESS_LEVEL_VALIDATION_MESSAGE })
  fitnessLevel: FitnessLevel;

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
  trainingType: TrainingType[];

  @Matches(CERTIFICATES_FILE_NAME_PATTERN, {
    message: CERTIFICATES_VALIDATION_MESSAGE,
  })
  certificates: string;

  @Length(ACHIEVEMENTS.MIN, ACHIEVEMENTS.MAX, {
    message: ACHIEVEMENTS_VALIDATION_MESSAGE,
  })
  achievements: string;
  @IsBoolean({ message: READY_FOR_WORKOUT_VALIDATION_MESSAGE })
  readyForWorkout: boolean;
}
