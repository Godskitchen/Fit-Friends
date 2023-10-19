import { Transform } from 'class-transformer';
import {
  IsEnum,
  ArrayMinSize,
  ArrayMaxSize,
  isArray,
  arrayMaxSize,
  arrayMinSize,
  Max,
  Min,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import {
  FITNESS_LEVEL_VALIDATION_MESSAGE,
  TRAINING_TYPE_VALIDATION_MESSAGE,
  TRAINING_TYPE_COUNT,
  TRAINING_TYPE_COUNT_VALIDATION_MESSAGE,
  TRAINING_DURATION_VALIDATION_MESSAGE,
  CALORIES_TO_BURN,
  CALORIES_TO_BURN_VALIDATION_MESSAGE,
  DAILY_CALORIES_INTAKE,
  DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE,
  READY_FOR_WORKOUT_VALIDATION_MESSAGE,
} from './constants';
import {
  FitnessLevel,
  TrainingDuration,
  TrainingType,
} from '@libs/shared/app-types';

export class UpdateUserProfileDto {
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

  @IsEnum(TrainingDuration, { message: TRAINING_DURATION_VALIDATION_MESSAGE })
  @IsOptional()
  trainingDuration?: TrainingDuration;

  @Max(CALORIES_TO_BURN.MIN, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @Min(CALORIES_TO_BURN.MIN, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @IsInt({ message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @IsOptional()
  caloriesToBurn?: number;

  @Max(DAILY_CALORIES_INTAKE.MAX, {
    message: DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE,
  })
  @Min(DAILY_CALORIES_INTAKE.MIN, {
    message: DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE,
  })
  @IsInt({ message: DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE })
  @IsOptional()
  dailyCaloriesIntake?: number;

  @IsBoolean({ message: READY_FOR_WORKOUT_VALIDATION_MESSAGE })
  @IsOptional()
  readyForWorkout?: boolean;
}
