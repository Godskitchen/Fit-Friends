import { RequestWithAccessTokenPayload, Role } from '@libs/shared/app-types';
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

@Controller('/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAccessGuard, RoleGuard)
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

  @UseGuards(JwtAccessGuard, RoleGuard)
  @Roles(Role.Trainer)
  @Get('/mylist')
  public async getOrderList(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: OrderQuery,
  ) {
    const orderList = this.orderService.getByUserId(user.sub, query);
    return fillRDO(OrderRdo, orderList);
  }
}
