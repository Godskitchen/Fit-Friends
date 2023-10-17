import { REGISTRATION_FORBIDDEN } from '@libs/shared/common';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PublicGuard
  extends AuthGuard('jwt-access')
  implements CanActivate
{
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuth = await super.canActivate(context);
    if (isAuth) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (user) {
        throw new ForbiddenException(REGISTRATION_FORBIDDEN);
      }
    }
    return true;
  }
}
