import {
  DEFAULT_SORT_DIRECTION,
  MAX_ITEMS_LIMIT,
  SortDirection,
  TrainingDuration,
  TrainingSortType,
  TrainingType,
} from '@libs/shared/app-types';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
  ArrayMinSize,
  ArrayMaxSize,
  IsEnum,
} from 'class-validator';
import {
  MAX_RATING,
  MIN_RATING,
  RANGE_ARRAYS_SIZE,
  MIN_PRICE,
  MIN_CALORIES,
} from './query.constants';

export class GeneralTrainingQuery {
  @Transform(({ value }) =>
    +value && +value < MAX_ITEMS_LIMIT && Number.isInteger(+value)
      ? +value
      : MAX_ITEMS_LIMIT,
  )
  @IsInt()
  @IsOptional()
  public limit: number = MAX_ITEMS_LIMIT;

  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public page?: number;

  @Max(MAX_RATING)
  @Min(MIN_RATING)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public rating?: number;

  @ArrayMinSize(RANGE_ARRAYS_SIZE)
  @ArrayMaxSize(RANGE_ARRAYS_SIZE)
  @Min(MIN_PRICE, { each: true })
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (value) {
      const priceRange = (value as string)
        .split(',')
        .map((it: string) => +it)
        .sort((num1, num2) => num1 - num2);

      if (priceRange.length < RANGE_ARRAYS_SIZE) {
        priceRange.unshift(MIN_PRICE);
      }
      return priceRange;
    }
    return value;
  })
  @IsOptional()
  public price?: number[];

  @ArrayMinSize(RANGE_ARRAYS_SIZE)
  @ArrayMaxSize(RANGE_ARRAYS_SIZE)
  @Min(MIN_CALORIES, { each: true })
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (value) {
      const caloriesRange = (value as string)
        .split(',')
        .map((it: string) => +it)
        .sort((num1, num2) => num1 - num2);

      if (caloriesRange.length < RANGE_ARRAYS_SIZE) {
        caloriesRange.unshift(MIN_CALORIES);
      }
      return caloriesRange;
    }
    return value;
  })
  @IsOptional()
  public caloriesToBurn?: number[];

  @IsEnum(TrainingDuration, { each: true })
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  public trainingDuration?: TrainingDuration[];

  @IsEnum(TrainingType, { each: true })
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  public trainingType?: TrainingType[];

  @IsEnum(TrainingSortType)
  @IsOptional()
  public sort?: TrainingSortType;

  @IsEnum(SortDirection)
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;
}
