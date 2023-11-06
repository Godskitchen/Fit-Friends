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
import {
  MAX_ITEMS_LIMIT,
  RequestWithAccessTokenPayload,
  Role,
} from '@libs/shared/app-types';
import { Roles } from '@libs/shared/common';
import {
  createAddFriendMessage,
  createRemoveFriendMessage,
} from './rdo/constants';
import { FriendRdo } from './rdo/friend.rdo';
import { FriendsQuery } from './queries/friends.query';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Пользователь неавторизован' })
@Controller('users')
@UseGuards(JwtAccessGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'Получена информация об указанном пользователе',
    type: UserRdo,
  })
  @ApiParam({
    name: 'userId',
    description: 'уникальный id пользователя - целое положительное число.',
  })
  @ApiNotFoundResponse({
    description: 'Пользователь с таким id не найден',
  })
  @ApiBadRequestResponse({
    description: 'Некорректный параметр id пользователя',
  })
  @Get('/details/:userId')
  public async getUserDetails(@Param('userId', ParseIntPipe) id: number) {
    const user = await this.userService.getDetails(id);
    return fillRDO(UserRdo, user, [user.role]);
  }

  @ApiOkResponse({
    description: 'Изменения успешно внесены в профиль пользователя',
    type: UserRdo,
  })
  @ApiParam({
    name: 'userId',
    description: 'уникальный id пользователя - целое положительное число.',
  })
  @ApiBadRequestResponse({
    description: 'Не пройдена валидация полей DTO',
  })
  @ApiForbiddenResponse({
    description: 'Попытка изменить чужой профиль пользователя',
  })
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

  @ApiOkResponse({
    description: `Получен список пользователей. По умолчанию возвращается ${MAX_ITEMS_LIMIT} пользователей`,
    type: [UserRdo],
  })
  @ApiBadRequestResponse({
    description: 'Не пройдена валидация полей query',
  })
  @Get('/')
  public async getUsers(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    userQuery: UserQuery,
  ) {
    const users = await this.userService.getMany(userQuery);
    return fillRDO(UserRdo, users, [Role.Trainer, Role.User]);
  }

  @ApiOkResponse({
    description: 'Выбранный пользователь добавлен в друзья',
  })
  @ApiForbiddenResponse({
    description: 'Данный маршрут недоступен для "тренеров".',
  })
  @ApiBadRequestResponse({
    description:
      'Некорректный id пользователя. Невозможно добавить самого себя в друзья. Пользователь с таким id не существует',
  })
  @ApiConflictResponse({
    description: 'Уже друзья с данным пользователем',
  })
  @ApiParam({
    name: 'userId',
    description: 'уникальный id пользователя - целое положительное число.',
  })
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
  @ApiOkResponse({
    description: 'Выбранный пользователь удален из друзей',
  })
  @ApiBadRequestResponse({
    description:
      'Некорректный id пользователя. Невозможно удалить самого себя из друзей. Пользователь с таким id не существует. Не друзья с данным пользователем',
  })
  @ApiParam({
    name: 'userId',
    description: 'уникальный id пользователя - целое положительное число.',
  })
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

  @ApiOkResponse({
    description: `Получен список друзей пользователя. По умолчанию возвращается ${MAX_ITEMS_LIMIT} пользователей`,
  })
  @ApiBadRequestResponse({
    description: 'Не пройдена валидация полей query',
  })
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
