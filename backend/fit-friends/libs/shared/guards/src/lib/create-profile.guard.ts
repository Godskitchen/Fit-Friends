import { UserRepository } from '@libs/database-service';
import {
  AccessTokenPayload,
  CreateProfileData,
  Role,
} from '@libs/shared/app-types';
import { UserErrors } from '@libs/shared/common';
import {
  BadRequestException,
  CanActivate,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CreateProfileGuard implements CanActivate {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params, body } = context.switchToHttp().getRequest<Request>();
    const { sub: userId, role } = user as AccessTokenPayload;

    const paramUserId = params.userId;
    if (!Number.isInteger(+paramUserId)) {
      throw new BadRequestException(UserErrors.INCORRECT_USER_ID_TYPE);
    }
    if (userId !== +paramUserId) {
      throw new ForbiddenException(UserErrors.MODIFY_USER_FORBIDDEN);
    }

    const profileData = body as CreateProfileData;
    if (!profileData.userProfile && !profileData.trainerProfile) {
      throw new BadRequestException(UserErrors.EMPTY_PROFILE_DATA);
    }
    if (
      (role === Role.Trainer && profileData.userProfile) ||
      (role === Role.User && profileData.trainerProfile)
    ) {
      throw new BadRequestException(UserErrors.INCORRECT_USER_PROFILE_TYPE);
    }

    const existUser = await this.userRepository.findById(userId);
    if (existUser?.trainerProfile || existUser?.userProfile) {
      throw new ConflictException(UserErrors.PROFILE_ALREADY_EXISTS);
    }

    return true;
  }
}
