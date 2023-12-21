import { Transform, Type } from 'class-transformer';
import {
  IsPositive,
  IsInt,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import {
  FitnessLevel,
  Location,
  MAX_ITEMS_LIMIT,
  MIN_PAGE_NUMBER,
  Role,
  TrainingType,
} from '@libs/shared/app-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserQuery {
  @ApiPropertyOptional({
    description:
      'Количество пользователей, по которым нужно получить информацию.',
    default: MAX_ITEMS_LIMIT,
    maximum: MAX_ITEMS_LIMIT,
  })
  @Transform(({ value }) =>
    +value && +value < MAX_ITEMS_LIMIT && Number.isInteger(+value)
      ? +value
      : MAX_ITEMS_LIMIT,
  )
  @IsInt()
  @IsOptional()
  public limit: number = MAX_ITEMS_LIMIT;

  @ApiPropertyOptional({
    description:
      'Пагинация списка. Запрашиваемый номер страницы списка пользователей. Положительное целое число',
    minimum: MIN_PAGE_NUMBER,
  })
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public page?: number;

  @ApiPropertyOptional({
    description: `Фильтр по локации пользователей. Доступные варианты: ${Object.values(
      Location,
    )}. Должны быть разделены запятой.`,
    type: String,
    example: `${Location.Pionerskaya},${Location.Sportivnaya}`,
  })
  @IsEnum(Location, { each: true })
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  public location?: Location[];

  @ApiPropertyOptional({
    description: `Фильтр по уровню фитнес-подготовки пользователя. Доступные варианты: ${Object.values(
      FitnessLevel,
    )}. Должны быть разделены запятой.`,
    type: String,
    example: `${FitnessLevel.Pro}`,
  })
  @IsEnum(FitnessLevel, { each: true })
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  public fitnessLevel?: FitnessLevel[];

  @ApiPropertyOptional({
    description: `Фильтр по уровню фитнес-подготовки пользователя. Доступные варианты: ${Object.values(
      TrainingType,
    )}. Должны быть разделены запятой.`,
    type: String,
    example: `${TrainingType.Aerobics},${TrainingType.Pilates}`,
  })
  @IsEnum(TrainingType, { each: true })
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  public trainingType?: TrainingType[];

  @ApiPropertyOptional({
    description: `Направление сортировки по роли пользователя. По умолчанию предусмотрена стандарная сортировка по дате регистрации пользователя. Доступные варианты: ${Object.values(
      Role,
    )}.`,
    type: String,
    enum: Role,
  })
  @IsEnum(Role)
  @IsOptional()
  public sort?: Role;

  @ApiPropertyOptional({
    description:
      'Фильтр по флагу готовности пользователя к тренировке. Булево значение',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  public isReady?: boolean;

  @ApiPropertyOptional({
    description: `Фильтр по роли пользователя. Доступные варианты: ${Object.values(
      Role,
    )}.`,
    type: String,
    enum: Role,
  })
  @IsEnum(Role)
  @IsOptional()
  public role?: Role;
}
