import {
  DEFAULT_SORT_DIRECTION,
  MAX_ITEMS_LIMIT,
  MIN_PAGE_NUMBER,
  SortDirection,
} from '@libs/shared/app-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';

export class ReplyQuery {
  @ApiPropertyOptional({
    description: 'Количество отзывов, по которым нужно получить информацию.',
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
      'Пагинация списка. Запрашиваемый номер страницы списка отзывов. Положительное целое число',
    minimum: MIN_PAGE_NUMBER,
  })
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public page?: number;

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
