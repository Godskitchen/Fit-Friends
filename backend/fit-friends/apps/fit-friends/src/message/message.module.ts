import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DatabaseModule, MessageRepository } from '@libs/database-service';

@Module({
  imports: [DatabaseModule],
  providers: [MessageService, MessageRepository],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
