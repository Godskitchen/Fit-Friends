import { UserRepository } from '@libs/database-service';
import {
  AccessTokenPayload,
  Role,
  UpdateUserData,
} from '@libs/shared/app-types';
import { UserErrors } from '@libs/shared/common';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ModifyProfileGuard implements CanActivate {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params, body } = context.switchToHttp().getRequest<Request>();
    const { sub: userId, role } = user as AccessTokenPayload;

    const paramsUserId = params.userId;
    if (!Number.isInteger(+paramsUserId)) {
      throw new BadRequestException(UserErrors.INCORRECT_USER_ID_TYPE);
    }
    if (userId !== +paramsUserId) {
      throw new ForbiddenException(UserErrors.MODIFY_USER_FORBIDDEN);
    }

    const updateData = body as UpdateUserData;
    if (
      (role === Role.Trainer && updateData.userProfile) ||
      (role === Role.User && updateData.trainerProfile)
    ) {
      throw new BadRequestException(UserErrors.INCORRECT_USER_PROFILE_TYPE);
    }

    return true;
  }
}
