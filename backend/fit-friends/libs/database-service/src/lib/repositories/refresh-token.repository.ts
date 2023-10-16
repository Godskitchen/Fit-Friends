import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../prisma/database.service';
import { RefreshTokenDataEntity } from '../entities/refresh-token-data.entity';
import { RefreshTokenData } from '@libs/shared/app-types';

@Injectable()
export class RefreshTokenRepository {
  private prisma;
  constructor(private readonly dbService: DatabaseService) {
    this.prisma = dbService.prismaPostgresConnector;
  }

  public async create(item: RefreshTokenDataEntity): Promise<RefreshTokenData> {
    const data = item.toObject();
    return this.prisma.refreshSession.create({ data });
  }

  public async deleteByTokenId(tokenId: string) {
    return this.prisma.refreshSession.delete({
      where: { tokenId },
    });
  }

  public async findByTokenId(
    tokenId: string,
  ): Promise<RefreshTokenData | null> {
    return this.prisma.refreshSession.findUnique({
      where: { tokenId },
    });
  }

  public async deleteExpiredTokens() {
    return this.prisma.refreshSession.deleteMany({
      where: {
        expiresIn: { lt: new Date() },
      },
    });
  }
}
