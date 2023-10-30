import {
  TrainingRequestRepository,
  UserRepository,
} from '@libs/database-service';
import { AccessTokenPayload } from '@libs/shared/app-types';
import {
  FORBIDDEN_REQUEST_TO_YOURSELF,
  INCORRECT_USER_ID_TYPE,
  NOT_FRIENDS,
  PENDING_REQUEST_ALREADY_EXISTS,
  RECEPIENT_IS_NOT_READY,
  USER_NOT_FOUND,
} from '@libs/shared/common';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CreateRequestGuard implements CanActivate {
  constructor(
    private readonly requestRepository: TrainingRequestRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async canActivate(cxt: ExecutionContext) {
    const { user, params } = cxt.switchToHttp().getRequest<Request>();
    const senderId = (user as AccessTokenPayload).sub;
    const recepientId = +params.recepientId;

    if (!Number.isInteger(recepientId) || recepientId <= 0) {
      throw new BadRequestException(INCORRECT_USER_ID_TYPE);
    }

    if (senderId === recepientId) {
      throw new BadRequestException(FORBIDDEN_REQUEST_TO_YOURSELF);
    }

    const recepient = await this.userRepository.findById(recepientId);
    if (!recepient) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const isFriends = await this.checkFriendship(senderId, recepientId);
    if (!isFriends) {
      throw new BadRequestException(NOT_FRIENDS);
    }

    if (
      (recepient.userProfile &&
        recepient.userProfile.readyForWorkout === false) ||
      (recepient.trainerProfile &&
        recepient.trainerProfile?.readyForWorkout === false)
    ) {
      throw new BadRequestException(RECEPIENT_IS_NOT_READY);
    }

    const existPendingRequest = await this.requestRepository.findPending(
      senderId,
      recepientId,
    );

    if (existPendingRequest) {
      throw new BadRequestException(PENDING_REQUEST_ALREADY_EXISTS);
    }

    return true;
  }

  private async checkFriendship(userId: number, recepientId: number) {
    const friendList = await this.userRepository.getFriends(userId);
    return friendList.map(({ userId }) => userId).includes(recepientId);
  }
}
