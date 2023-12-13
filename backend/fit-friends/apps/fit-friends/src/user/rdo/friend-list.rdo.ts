import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FriendRdo } from './friend.rdo';

export class FriendListRdo {
  @ApiProperty({ type: [FriendRdo] })
  @Expose()
  @Type(() => FriendRdo)
  friendList: FriendRdo[];

  @ApiProperty({ example: 6 })
  @Expose()
  totalFriendsCount: number;
}
