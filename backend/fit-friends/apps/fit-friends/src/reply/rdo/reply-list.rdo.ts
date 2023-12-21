import { ApiProperty } from '@nestjs/swagger';
import { ReplyRdo } from './reply.rdo';
import { Expose, Type } from 'class-transformer';

export class ReplyListRdo {
  @ApiProperty({ type: [ReplyRdo] })
  @Expose()
  @Type(() => ReplyRdo)
  replyList: ReplyRdo[];

  @ApiProperty({ example: 6 })
  @Expose()
  totalRepliesCount: number;
}
