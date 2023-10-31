import { UserRdo } from '@app/user';
import { Expose, Type } from 'class-transformer';

export class ReplyRdo {
  @Expose()
  replyId: number;

  @Expose()
  text: string;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => UserRdo)
  author: UserRdo;
}
