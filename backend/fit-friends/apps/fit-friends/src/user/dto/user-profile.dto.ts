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
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: `Уровень фитнес-подготовки пользователя. Доступные варианты: ${Object.values(
      FitnessLevel,
    ).join(',')}`,
    enum: FitnessLevel,
    example: FitnessLevel.Amateur,
  })
  @IsEnum(FitnessLevel, { message: FITNESS_LEVEL_VALIDATION_MESSAGE })
  fitnessLevel: FitnessLevel;

  @ApiProperty({
    description: `Типы тренировок пользователя. Доступные варианты: ${Object.values(
      TrainingType,
    ).join(',')}. От ${TRAINING_TYPE_COUNT.MIN} до ${
      TRAINING_TYPE_COUNT.MAX
    } типов`,
    isArray: true,
    enum: TrainingType,
    maxItems: TRAINING_TYPE_COUNT.MAX,
    minItems: TRAINING_TYPE_COUNT.MIN,
    example: [TrainingType.Aerobics, TrainingType.Boxing],
  })
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

  @ApiProperty({
    description: `Длительность тренировки. Доступные варианты: ${Object.values(
      TrainingDuration,
    ).join(',')}.`,
    enum: TrainingDuration,
    example: TrainingDuration.EightyToOneHundredMinutes,
  })
  @IsEnum(TrainingDuration, { message: TRAINING_DURATION_VALIDATION_MESSAGE })
  trainingDuration: TrainingDuration;

  @ApiProperty({
    description: `Планируемое ежедневное количество затрачиваемых калорий. Целое число в диапазоне от ${CALORIES_TO_BURN.MIN} до ${CALORIES_TO_BURN.MAX}`,
    minimum: CALORIES_TO_BURN.MIN,
    maximum: CALORIES_TO_BURN.MAX,
    example: 1500,
  })
  @Max(CALORIES_TO_BURN.MIN, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @Min(CALORIES_TO_BURN.MIN, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @IsInt({ message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @Type(() => Number)
  caloriesToBurn: number;

  @ApiProperty({
    description: `Ежедневное количество потребляемых калорий. Целое число в диапазоне от ${DAILY_CALORIES_INTAKE.MIN} до ${DAILY_CALORIES_INTAKE.MAX}`,
    minimum: DAILY_CALORIES_INTAKE.MIN,
    maximum: DAILY_CALORIES_INTAKE.MAX,
    example: 1500,
  })
  @Max(DAILY_CALORIES_INTAKE.MAX, {
    message: DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE,
  })
  @Min(DAILY_CALORIES_INTAKE.MIN, {
    message: DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE,
  })
  @IsInt({ message: DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE })
  @Type(() => Number)
  dailyCaloriesIntake: number;

  @ApiProperty({
    description: 'Флаг готовности пользователя к тренировкам',
    type: Boolean,
    example: true,
  })
  @IsBoolean({ message: READY_FOR_WORKOUT_VALIDATION_MESSAGE })
  readyForWorkout: boolean;
}
