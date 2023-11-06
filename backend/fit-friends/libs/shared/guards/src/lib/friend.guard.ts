import { UserRepository } from '@libs/database-service';
import { AccessTokenPayload } from '@libs/shared/app-types';
import { UserErrors } from '@libs/shared/common';
import {
  BadRequestException,
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

const ADD_FRIEND_HANDLER = 'addFriend';
const REMOVE_FRIEND_HANDLER = 'removeFriend';

@Injectable()
export class FriendGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(cxt: ExecutionContext) {
    const currentHandler = cxt.getHandler().name;
    const { user, params } = cxt.switchToHttp().getRequest<Request>();

    const userId = (user as AccessTokenPayload).sub;
    const friendId = +params.friendId;

    if (!Number.isInteger(friendId) || friendId <= 0) {
      throw new BadRequestException(UserErrors.INCORRECT_USER_ID_TYPE);
    }

    if (userId === friendId) {
      throw new BadRequestException(
        UserErrors.FORBIDDEN_ADD_REMOVE_FRIEND_YOURSELF,
      );
    }
    const friend = await this.userRepository.findById(friendId);
    if (!friend) {
      throw new BadRequestException(UserErrors.USER_NOT_FOUND);
    }

    const isFriends = await this.checkFriendship(userId, friendId);
    if (currentHandler === ADD_FRIEND_HANDLER && isFriends) {
      throw new ConflictException(UserErrors.ALREADY_FRIENDS);
    }

    if (currentHandler === REMOVE_FRIEND_HANDLER && !isFriends) {
      throw new BadRequestException(UserErrors.NOT_FRIENDS);
    }

    return true;
  }

  private async checkFriendship(userId: number, friendId: number) {
    const friendList = await this.userRepository.findFriend(userId, friendId);
    return friendList.map(({ userId }) => userId).includes(friendId);
  }
}
