import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { MAX_ORDERS_LIMIT } from './query.constants';
import { SortDirection, SortType } from '@libs/shared/app-types';

export class OrderQuery {
  @Transform(({ value }) =>
    +value && +value < MAX_ORDERS_LIMIT && Number.isInteger(+value)
      ? +value
      : MAX_ORDERS_LIMIT,
  )
  @IsInt()
  @IsOptional()
  public limit: number = MAX_ORDERS_LIMIT;

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
  public direction?: SortDirection;
}
