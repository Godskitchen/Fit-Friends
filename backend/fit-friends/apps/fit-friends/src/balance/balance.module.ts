import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import {
  BalanceRepository,
  DatabaseModule,
  TrainingRepository,
} from '@libs/database-service';

@Module({
  imports: [DatabaseModule],
  providers: [BalanceService, BalanceRepository, TrainingRepository],
  controllers: [BalanceController],
})
export class BalanceModule {}
