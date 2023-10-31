import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import {
  DEFAULT_SORT_DIRECTION,
  MAX_ITEMS_LIMIT,
  SortDirection,
  SortType,
} from '@libs/shared/app-types';

export class OrderQuery {
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

  @IsEnum(SortType)
  @IsOptional()
  public sort?: SortType;

  @IsEnum(SortDirection)
  @IsOptional()
  public direction: SortDirection = DEFAULT_SORT_DIRECTION;
}
