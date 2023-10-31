import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import {
  BalanceRepository,
  DatabaseModule,
  ReplyRepository,
  TrainingRepository,
} from '@libs/database-service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ReplyService,
    ReplyRepository,
    TrainingRepository,
    BalanceRepository,
  ],
  controllers: [ReplyController],
  exports: [],
})
export class ReplyModule {}
