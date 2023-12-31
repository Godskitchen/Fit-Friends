import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import {
  MIN_CALORIES,
  MIN_PRICE,
  RANGE_ARRAYS_SIZE,
  RATING,
} from './query.constants';
import {
  DEFAULT_SORT_DIRECTION,
  MAX_ITEMS_LIMIT,
  MIN_PAGE_NUMBER,
  SortDirection,
  TrainingDuration,
} from '@libs/shared/app-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserTrainingsQuery {
  @ApiPropertyOptional({
    description: 'Количество тренировок, по которым нужно получить информацию.',
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
      'Пагинация списка. Запрашиваемый номер страницы списка тренировок. Положительное целое число',
    minimum: MIN_PAGE_NUMBER,
  })
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public page?: number;

  @ApiPropertyOptional({
    description: `Фильтр тренировок по рейтингу. Допускается как ввод диапазона "от" и "до" через ",", так и одно значение, в этом случае будет выбран диапазон от ${RATING.MIN} до переданного значения. Целые неотрицательные числа`,
    minimum: RATING.MIN,
    maximum: RATING.MAX,
    example: '1,5',
  })
  @ArrayMinSize(RANGE_ARRAYS_SIZE)
  @ArrayMaxSize(RANGE_ARRAYS_SIZE)
  @Min(RATING.MIN, { each: true })
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (value) {
      const ratingRange = (value as string)
        .split(',')
        .map((it: string) => +it)
        .sort((num1, num2) => num1 - num2);

      if (ratingRange.length < RANGE_ARRAYS_SIZE) {
        ratingRange.unshift(RATING.MIN);
      }
      return ratingRange;
    }
    return value;
  })
  @IsOptional()
  public rating?: number[];

  @ApiPropertyOptional({
    description: `Фильтр тренировок по цене. Допускается как ввод диапазона "от" и "до" через ",", так и одно значение, в этом случае будет выбран диапазон от ${MIN_PRICE} до переданного значения. Целые неотрицательные числа`,
    type: String,
    example: '100,500',
  })
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

  @ApiPropertyOptional({
    description: `Фильтр тренировок по калориям. Допускается как ввод диапазона "от" и "до" через ",", так и одно значение, в этом случае будет выбран диапазон от ${MIN_CALORIES} до переданного значения. Целые неотрицательные числа`,
    type: String,
    example: '1000,1400',
  })
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

  @ApiPropertyOptional({
    description: `Фильтр тренировок по длительности. Значения передаются через ",". Доступные варианты ${Object.values(
      TrainingDuration,
    ).join(',')}`,
    type: String,
    example: `${TrainingDuration.EightyToOneHundredMinutes},${TrainingDuration.TenToThirtyMinutes}`,
  })
  @IsEnum(TrainingDuration, { each: true })
  @Transform(({ value }) => (value ? value.split(',') : value))
  @IsOptional()
  public trainingDuration?: TrainingDuration[];

  @ApiPropertyOptional({
    description: `Направление сортировки. По умолчанию предусмотрено направление "по убыванию". Доступные варианты: ${Object.values(
      SortDirection,
    )}.`,
    enum: SortDirection,
    default: DEFAULT_SORT_DIRECTION,
  })
  @IsEnum(SortDirection)
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;
}
