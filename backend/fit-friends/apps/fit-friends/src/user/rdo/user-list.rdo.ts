import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserRdo } from './user.rdo';

export class UserListRdo {
  @ApiProperty({ type: [UserRdo] })
  @Expose()
  @Type(() => UserRdo)
  userList: UserRdo[];

  @ApiProperty({ example: 6 })
  @Expose()
  totalUsersCount: number;
}
