import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';

@Module({
  imports: [],
  providers: [ReplyService],
  controllers: [ReplyController],
  exports: [],
})
export class ReplyModule {}
