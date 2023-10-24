import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from '@libs/database-service';
import { JwtAccessGuard } from '@libs/shared/guards';

@Module({
  imports: [],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
