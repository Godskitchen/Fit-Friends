import {
  DEFAULT_SORT_DIRECTION,
  MAX_ITEMS_LIMIT,
  MIN_PAGE_NUMBER,
  SortDirection,
} from '@libs/shared/app-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsEnum } from 'class-validator';

export class FriendsQuery {
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
    description: `Направление сортировки списка. Доступные значения ${Object.values(
      SortDirection,
    ).join(',')}`,
    default: DEFAULT_SORT_DIRECTION,
    enum: SortDirection,
  })
  @IsEnum(SortDirection)
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;
}
