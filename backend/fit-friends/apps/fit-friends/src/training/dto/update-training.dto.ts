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
  VideoFormats,
} from './constants';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTrainingDto {
  @ApiPropertyOptional({
    description: `Наименование тренировки от ${TITLE_LENGTH.MIN} до ${TITLE_LENGTH.MAX} символов`,
    minLength: TITLE_LENGTH.MIN,
    maxLength: TITLE_LENGTH.MAX,
    example: 'Energy',
  })
  @Length(TITLE_LENGTH.MIN, TITLE_LENGTH.MAX, {
    message: TITLE_VALIDATION_MESSAGE,
  })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: `Рекомендуемый уровень фитнес-подготовки для данной тренировки. Доступные варианты: ${Object.values(
      FitnessLevel,
    ).join(',')}`,
    enum: FitnessLevel,
    example: FitnessLevel.Amateur,
  })
  @IsEnum(FitnessLevel, { message: FITNESS_LEVEL_VALIDATION_MESSAGE })
  @IsOptional()
  fitnessLevel?: FitnessLevel;

  @ApiPropertyOptional({
    description: `Длительность тренировки. Доступные варианты: ${Object.values(
      TrainingDuration,
    ).join(',')}.`,
    enum: TrainingDuration,
    example: TrainingDuration.EightyToOneHundredMinutes,
  })
  @IsEnum(TrainingDuration, { message: TRAINING_DURATION_VALIDATION_MESSAGE })
  @IsOptional()
  trainingDuration?: TrainingDuration;

  @ApiPropertyOptional({
    description: `Тип тренировки. Доступные варианты: ${Object.values(
      TrainingType,
    ).join(',')}`,
    enum: TrainingType,
    example: TrainingType.Aerobics,
  })
  @IsEnum(TrainingType, { message: TRAINING_TYPE_VALIDATION_MESSAGE })
  @IsOptional()
  trainingType?: TrainingType;

  @ApiPropertyOptional({
    description: `Стоимость тренировки. Целое неотрицательное число`,
    minimum: PRICE_MIN,
    example: 500,
  })
  @Min(PRICE_MIN, { message: PRICE_VALIDATION_MESSAGE })
  @IsInt({ message: PRICE_VALIDATION_MESSAGE })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: `Количество затрачиваемых калорий за тренировку. Целое начение от ${CALORIES_TO_BURN.MIN} до ${CALORIES_TO_BURN.MAX}`,
    minimum: CALORIES_TO_BURN.MIN,
    maximum: CALORIES_TO_BURN.MAX,
    example: 1500,
  })
  @Max(CALORIES_TO_BURN.MAX, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @Min(CALORIES_TO_BURN.MIN, { message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @IsInt({ message: CALORIES_TO_BURN_VALIDATION_MESSAGE })
  @IsOptional()
  caloriesToBurn?: number;

  @ApiPropertyOptional({
    description: `Описание трениовки. От ${TRAINING_DESCRIPTION_LENGTH.MIN} до ${TRAINING_DESCRIPTION_LENGTH.MAX} символов`,
    minLength: TRAINING_DESCRIPTION_LENGTH.MIN,
    maxLength: TRAINING_DESCRIPTION_LENGTH.MAX,
    example: 'Очень эффективная тренировка для проработки всех частей тела',
  })
  @Length(TRAINING_DESCRIPTION_LENGTH.MIN, TRAINING_DESCRIPTION_LENGTH.MAX, {
    message: DESCRIPTION_VALIDATION_MESSAGE,
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: `Пол пользователя, для которого рекомендуется тренировка. Доступные варианты: ${Object.values(
      Gender,
    ).join(',')}`,
    enum: Gender,
    example: Gender.Male,
  })
  @IsEnum(Gender, { message: GENDER_VALIDATION_MESSAGE })
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({
    description: `Наименование видео-файла тренировки. Файл должен быть предварительно загружен на сервер. Доступные форматы ${Object.values(
      VideoFormats,
    ).join(',')}`,
    pattern: VIDEO_FILE_NAME_PATTERN,
    example: 'video.mov',
  })
  @Matches(RegExp(VIDEO_FILE_NAME_PATTERN, 'i'), {
    message: VIDEO_FILE_VALIDATION_MESSAGE,
  })
  @IsOptional()
  video?: string;

  @ApiPropertyOptional({
    description: 'Флаг участия тренировки в спецпредложениях',
    type: Boolean,
    example: false,
  })
  @IsBoolean({ message: SPECIAL_OFFER_VALIDATION_MESSAGE })
  @Type(() => Boolean)
  @IsOptional()
  isSpecialOffer?: boolean;
}
