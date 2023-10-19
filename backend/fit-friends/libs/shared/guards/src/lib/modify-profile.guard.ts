import { UserRepository } from '@libs/database-service';
import {
  AccessTokenPayload,
  Role,
  UpdateUserData,
} from '@libs/shared/app-types';
import {
  ACCESS_DENIED,
  INCORRECT_ID,
  INCORRECT_USER_PROFILE_TYPE,
  MODIFY_OTHER_USER_FORBIDDEN,
  USER_NOT_FOUND,
} from '@libs/shared/common';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ModifyProfileGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.user) {
      throw new UnauthorizedException(ACCESS_DENIED);
    }
    const { sub: userId, role } = request.user as AccessTokenPayload;
    const existUser = await this.userRepository.findById(userId);
    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const paramsUserId = request.params.userId;
    if (!Number.isInteger(+paramsUserId)) {
      throw new BadRequestException(INCORRECT_ID);
    }
    if (userId !== +paramsUserId) {
      throw new ForbiddenException(MODIFY_OTHER_USER_FORBIDDEN);
    }

    const updateData = request.body as UpdateUserData;
    if (
      (role === Role.Trainer && updateData.userProfile) ||
      (role === Role.User && updateData.trainerProfile)
    ) {
      throw new BadRequestException(INCORRECT_USER_PROFILE_TYPE);
    }

    return true;
  }
}
