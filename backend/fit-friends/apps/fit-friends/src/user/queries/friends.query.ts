import {
  DEFAULT_SORT_DIRECTION,
  MAX_ITEMS_LIMIT,
  SortDirection,
} from '@libs/shared/app-types';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsEnum } from 'class-validator';

export class FriendsQuery {
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

  @IsEnum(SortDirection)
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;
}
