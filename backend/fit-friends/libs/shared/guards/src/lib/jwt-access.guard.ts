/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthErrors } from '@libs/shared/common';
import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAccessGuard extends AuthGuard('jwt-access') {
  handleRequest(err: any, user: any, _info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException(AuthErrors.ACCESS_DENIED);
    }
    return user;
  }
}
