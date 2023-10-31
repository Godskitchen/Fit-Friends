import { AuthErrors } from '@libs/shared/common';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class PublicGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const { headers } = ctx.switchToHttp().getRequest<Request>();
    if (headers['authorization']) {
      throw new ForbiddenException(AuthErrors.REGISTRATION_FORBIDDEN);
    }

    return true;
  }
}
