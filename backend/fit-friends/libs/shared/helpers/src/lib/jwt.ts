import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export async function getJwtAccessOptions(
  configService: ConfigService,
): Promise<JwtSignOptions> {
  return {
    secret: configService.getOrThrow<string>('jwt.accessTokenSecret'),
    expiresIn: configService.getOrThrow<string>('jwt.accessTokenExpiresIn'),
  };
}

export async function getJwtRefreshOptions(
  configService: ConfigService,
): Promise<JwtSignOptions> {
  return {
    secret: configService.getOrThrow<string>('jwt.refreshTokenSecret'),
    expiresIn: configService.getOrThrow<string>('jwt.refreshTokenExpiresIn'),
  };
}
