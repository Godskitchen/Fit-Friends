import { Module } from '@nestjs/common';
import { TrainingRequestService } from './training-request.service';
import { TrainingRequestController } from './training-request.controller';
import {
  DatabaseModule,
  TrainingRequestRepository,
} from '@libs/database-service';
import { MessageModule } from '@app/message';

@Module({
  imports: [DatabaseModule, MessageModule],
  providers: [TrainingRequestService, TrainingRequestRepository],
  controllers: [TrainingRequestController],
  exports: [TrainingRequestService],
})
export class TrainingRequestModule {}
