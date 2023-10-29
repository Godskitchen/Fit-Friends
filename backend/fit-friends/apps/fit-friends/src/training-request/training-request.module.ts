import { Module } from '@nestjs/common';
import { TrainingRequestService } from './training-request.service';
import { TrainingRequestController } from './training-request.controller';

@Module({
  imports: [],
  providers: [TrainingRequestService],
  controllers: [TrainingRequestController],
  exports: [TrainingRequestService],
})
export class TrainingRequestModule {}
