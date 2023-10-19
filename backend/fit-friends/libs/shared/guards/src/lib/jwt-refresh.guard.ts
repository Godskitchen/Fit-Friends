import { REFRESH_TOKEN_NAME } from '@app/auth';
import { RefreshTokenRepository } from '@libs/database-service';
import { RefreshTokenPayload } from '@libs/shared/app-types';
import { ACCESS_DENIED } from '@libs/shared/common';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies[REFRESH_TOKEN_NAME];
    if (!refreshToken) {
      throw new UnauthorizedException(ACCESS_DENIED);
    }

    const tokenPayload = await this.jwtService
      .verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.getOrThrow('jwt.refreshTokenSecret'),
      })
      .catch(() => null);
    if (!tokenPayload) {
      throw new UnauthorizedException(ACCESS_DENIED);
    }

    const existToken = await this.refreshTokenRepository.findByUserId(
      tokenPayload.sub,
    );
    if (!existToken) {
      throw new UnauthorizedException(ACCESS_DENIED);
    }

    await this.refreshTokenRepository.deleteByUserId(existToken.userId);
    if (existToken.expiresIn < new Date()) {
      throw new UnauthorizedException(ACCESS_DENIED);
    }
    request.user = { ...tokenPayload };

    return true;
  }
}
