import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { MAX_BALANCE_LIMIT } from './query.constants';

export class BalanceQuery {
  @Transform(({ value }) =>
    +value && +value < MAX_BALANCE_LIMIT && Number.isInteger(+value)
      ? +value
      : MAX_BALANCE_LIMIT,
  )
  @IsInt()
  @IsOptional()
  public limit: number = MAX_BALANCE_LIMIT;

  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public page?: number;
}
