import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import {
  DEFAULT_SORT_DIRECTION,
  MAX_ITEMS_LIMIT,
  SortDirection,
  OrderSortType,
  MIN_PAGE_NUMBER,
} from '@libs/shared/app-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrderQuery {
  @ApiPropertyOptional({
    description: 'Количество заказов, по которым нужно получить информацию.',
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
      'Пагинация списка. Запрашиваемый номер страницы списка заказов. Положительное целое число',
    minimum: MIN_PAGE_NUMBER,
  })
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  public page?: number;

  @ApiPropertyOptional({
    description: `Тип сортировки списка заказов - по стоимости заказа или по кол-ву приобретенных тренировок. Доступные варианты ${Object.values(
      OrderSortType,
    ).join(
      ',',
    )}. По умолчанию предусмотрена сортировка по дате создания заказа`,
    enum: OrderSortType,
    example: `${OrderSortType.sum}`,
  })
  @IsEnum(OrderSortType)
  @IsOptional()
  public sort?: OrderSortType;

  @ApiPropertyOptional({
    description: `Направление сортировки. По умолчанию предусмотрено направление "по убыванию". Доступные варианты: ${Object.values(
      SortDirection,
    )}.`,
    enum: SortDirection,
    default: DEFAULT_SORT_DIRECTION,
  })
  @IsEnum(SortDirection)
  @IsOptional()
  public direction: SortDirection = DEFAULT_SORT_DIRECTION;
}
