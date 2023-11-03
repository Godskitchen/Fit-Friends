import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { fillRDO } from '@libs/shared/helpers';
import { UserRdo } from './rdo/user.rdo';
import {
  FriendGuard,
  JwtAccessGuard,
  ModifyProfileGuard,
  RoleGuard,
} from '@libs/shared/guards';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQuery } from './queries/user.query';
import { RequestWithAccessTokenPayload, Role } from '@libs/shared/app-types';
import { Roles } from '@libs/shared/common';
import {
  createAddFriendMessage,
  createRemoveFriendMessage,
} from './rdo/constants';
import { FriendRdo } from './rdo/friend.rdo';
import { FriendsQuery } from './queries/friends.query';

@Controller('users')
@UseGuards(JwtAccessGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/details/:userId')
  public async getUserDetails(@Param('userId', ParseIntPipe) id: number) {
    const user = await this.userService.getDetails(id);
    return fillRDO(UserRdo, user, [user.role]);
  }

  @UseGuards(ModifyProfileGuard)
  @Patch('/details/:userId')
  public async updateUserData(
    @Param('userId', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateData(id, dto);
    return fillRDO(UserRdo, updatedUser, [updatedUser.role]);
  }

  @Get('/')
  public async getUsers(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    userQuery: UserQuery,
  ) {
    const users = await this.userService.getMany(userQuery);
    return fillRDO(UserRdo, users, [Role.Trainer, Role.User]);
  }

  @UseGuards(RoleGuard, FriendGuard)
  @Roles(Role.User)
  @Patch('/friends/add/:friendId')
  public async addFriend(
    @Param('friendId', ParseIntPipe) friendId: number,
    @Req() { user }: RequestWithAccessTokenPayload,
  ) {
    await this.userService.addFriend(user.sub, user.name, friendId);
    return {
      message: createAddFriendMessage(friendId),
    };
  }

  @UseGuards(FriendGuard)
  @Patch('/friends/remove/:friendId')
  public async removeFriend(
    @Param('friendId', ParseIntPipe) friendId: number,
    @Req() { user }: RequestWithAccessTokenPayload,
  ) {
    await this.userService.removeFriend(user.sub, friendId);
    return {
      message: createRemoveFriendMessage(friendId),
    };
  }

  @Get('/friends')
  public async getFriendList(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: FriendsQuery,
  ) {
    const friendList = await this.userService.getFriendList(user.sub, query);
    return fillRDO(FriendRdo, friendList, [Role.Trainer, Role.User]);
  }
}
