import { RefreshTokenDataEntity } from '@libs/database-service';
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

  public async deleteRefreshSession(tokenId: string) {
    await this.deleteExpiredRefreshTokens();
    return this.refreshTokenRepository.deleteByTokenId(tokenId);
  }

  public async isExists(tokenId: string): Promise<boolean> {
    const refreshToken =
      await this.refreshTokenRepository.findByTokenId(tokenId);
    return refreshToken !== null;
  }

  public async deleteExpiredRefreshTokens() {
    return this.refreshTokenRepository.deleteExpiredTokens();
  }
}
