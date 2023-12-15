import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserRdo } from './user.rdo';

export class FriendListRdo {
  @ApiProperty({ type: [UserRdo] })
  @Expose()
  @Type(() => UserRdo)
  friendList: UserRdo[];

  @ApiProperty({ example: 6 })
  @Expose()
  totalFriendsCount: number;
}
