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
import { ApiProperty } from '@nestjs/swagger';

export class TrainerProfileDto {
  @ApiProperty({
    description: `Уровень фитнес-подготовки тренера. Доступные варианты: ${Object.values(
      FitnessLevel,
    ).join(',')}`,
    enum: FitnessLevel,
    example: FitnessLevel.Amateur,
  })
  @IsEnum(FitnessLevel, { message: FITNESS_LEVEL_VALIDATION_MESSAGE })
  fitnessLevel: FitnessLevel;

  @ApiProperty({
    description: `Типы тренировок тренера. Доступные варианты: ${Object.values(
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
    description:
      'Наименование pdf-файла. Файл должен быть предварительно загружен на сервер',
    pattern: CERTIFICATES_FILE_NAME_PATTERN,
    example: 'certificate.pdf',
  })
  @Matches(RegExp(CERTIFICATES_FILE_NAME_PATTERN, 'i'), {
    message: CERTIFICATES_VALIDATION_MESSAGE,
  })
  certificates: string;

  @ApiProperty({
    description: 'Описание достижений тренера',
    minimum: ACHIEVEMENTS.MIN,
    maximum: ACHIEVEMENTS.MAX,
    example: 'Подробное описание тренерских заслуг.',
  })
  @Length(ACHIEVEMENTS.MIN, ACHIEVEMENTS.MAX, {
    message: ACHIEVEMENTS_VALIDATION_MESSAGE,
  })
  achievements: string;

  @ApiProperty({
    description: 'Флаг готовности тренера проводить тренировки',
    type: Boolean,
    example: true,
  })
  @IsBoolean({ message: READY_FOR_WORKOUT_VALIDATION_MESSAGE })
  readyForWorkout: boolean;
}
