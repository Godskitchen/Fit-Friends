import { Module } from '@nestjs/common';
import { TrainingRequestService } from './training-request.service';
import { TrainingRequestController } from './training-request.controller';
import {
  DatabaseModule,
  TrainingRequestRepository,
  UserRepository,
} from '@libs/database-service';
import { MessageModule } from '@app/message';
import { UserModule } from '@app/user';

@Module({
  imports: [DatabaseModule, MessageModule, UserModule],
  providers: [
    TrainingRequestService,
    TrainingRequestRepository,
    UserRepository,
  ],
  controllers: [TrainingRequestController],
  exports: [TrainingRequestService],
})
export class TrainingRequestModule {}
