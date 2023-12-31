import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {
  BalanceRepository,
  DatabaseModule,
  OrderRepository,
  TrainingRepository,
} from '@libs/database-service';

@Module({
  imports: [DatabaseModule],
  providers: [
    OrderService,
    OrderRepository,
    TrainingRepository,
    BalanceRepository,
  ],
  controllers: [OrderController],
})
export class OrderModule {}
