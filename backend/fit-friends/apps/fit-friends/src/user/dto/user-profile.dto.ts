import {
  FitnessLevel,
  TrainingDuration,
  TrainingType,
} from '@libs/shared/app-types';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsInt,
  Max,
  Min,
  arrayMaxSize,
  arrayMinSize,
  isArray,
} from 'class-validator';
import {
  CALORIES_TO_BURN,
  CALORIES_TO_BURN_VALIDATION_MESSAGE,
  DAILY_CALORIES_INTAKE,
  DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE,
  FITNESS_LEVEL_VALIDATION_MESSAGE,
  READY_FOR_WORKOUT_VALIDATION_MESSAGE,
  TRAINING_DURATION_VALIDATION_MESSAGE,
  TRAINING_TYPE_COUNT,
  TRAINING_TYPE_COUNT_VALIDATION_MESSAGE,
  TRAINING_TYPE_VALIDATION_MESSAGE,
} from './constants';
import { Transform } from 'class-transformer';

export class UserProfileDto {
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

  @IsEnum(TrainingDuration, { message: TRAINING_DURATION_VALIDATION_MESSAGE })
  trainingDuration: TrainingDuration;

  @Max(CALORIES_TO_BURN.MIN, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @Min(CALORIES_TO_BURN.MIN, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @IsInt({ message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  caloriesToBurn: number;

  @Max(DAILY_CALORIES_INTAKE.MAX, {
    message: DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE,
  })
  @Min(DAILY_CALORIES_INTAKE.MIN, {
    message: DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE,
  })
  @IsInt({ message: DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE })
  dailyCaloriesIntake: number;

  @IsBoolean({ message: READY_FOR_WORKOUT_VALIDATION_MESSAGE })
  readyForWorkout: boolean;
}
