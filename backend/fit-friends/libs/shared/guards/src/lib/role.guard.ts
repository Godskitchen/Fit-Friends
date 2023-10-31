import { AccessTokenPayload, Role } from '@libs/shared/app-types';
import { UserErrors } from '@libs/shared/common';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const roles = this.reflector.get<Role[]>('roles', ctx.getHandler());
    if (!roles) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest<Request>();
    const { role } = request.user as AccessTokenPayload;

    if (!roles.includes(role)) {
      throw new ForbiddenException(UserErrors.FORBIDDEN_BY_ROLE);
    }

    return true;
  }
}
