import {
  RefreshTokenDataEntity,
  RefreshTokenRepository,
} from '@libs/database-service';
import { RefreshTokenPayload } from '@libs/shared/app-types';
import { parseTokenTime } from '@libs/shared/helpers';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService,
  ) {}

  public async createRefreshSession(payload: RefreshTokenPayload) {
    const { value, unit } = parseTokenTime(
      this.configService.getOrThrow<string>('jwt.refreshTokenExpiresIn'),
    );
    const refreshToken = new RefreshTokenDataEntity({
      tokenId: payload.tokenId,
      userId: payload.sub,
      expiresIn: dayjs().add(value, unit).toDate(),
    });

    return this.refreshTokenRepository.create(refreshToken);
  }

  public async getRefreshSession(userId: number) {
    return this.refreshTokenRepository.findByUserId(userId);
  }

  public async deleteRefreshSession(userId: number) {
    return this.refreshTokenRepository.deleteByUserId(userId);
  }

  public async isExists(userId: number): Promise<boolean> {
    const refreshTokenData =
      await this.refreshTokenRepository.findByUserId(userId);
    return refreshTokenData !== null;
  }
}
