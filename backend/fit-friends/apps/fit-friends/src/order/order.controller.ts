import {
  MAX_ITEMS_LIMIT,
  RequestWithAccessTokenPayload,
  Role,
} from '@libs/shared/app-types';
import { Roles } from '@libs/shared/common';
import { JwtAccessGuard, RoleGuard } from '@libs/shared/guards';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { NewOrderDto } from './dto/new-order.dto';
import { OrderService } from './order.service';
import { fillRDO } from '@libs/shared/helpers';
import { OrderRdo } from './rdo/order.rdo';
import { OrderQuery } from './queries/order.query';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OrderListRdo } from './rdo/order-list.rdo';

@ApiTags('orders')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Пользователь неавторизован',
})
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiCreatedResponse({
    description: 'Заказ создан успешно. Получена информация о заказе',
    type: OrderRdo,
  })
  @ApiForbiddenResponse({
    description: 'Данный маршрут доступен только обычным пользователям',
  })
  @ApiBadRequestResponse({
    description:
      'Не пройдена валидация полей DTO. Тренировка с указанным id не найдена',
  })
  @Roles(Role.User)
  @Post('/create')
  public async createOrder(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: NewOrderDto,
  ) {
    const newOrder = this.orderService.create(dto, user.sub);
    return fillRDO(OrderRdo, newOrder);
  }

  @ApiOkResponse({
    description: `Получен список тренировок, приобретенных у данного тренера, а также общая цена и их количество. По умолчанию возвращается ${MAX_ITEMS_LIMIT} заказов`,
    type: OrderListRdo,
  })
  @ApiForbiddenResponse({
    description: 'Данный маршрут доступен только тренерам',
  })
  @ApiBadRequestResponse({
    description: 'Не пройдена валидация полей query',
  })
  @Roles(Role.Trainer)
  @Get('/mylist')
  public async getOrderList(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: OrderQuery,
  ) {
    const orderList = this.orderService.getByUserId(user.sub, query);
    return fillRDO(OrderListRdo, orderList);
  }
}
