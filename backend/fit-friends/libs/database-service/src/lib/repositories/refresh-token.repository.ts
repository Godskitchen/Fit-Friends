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
    return this.prisma.refreshTokenData.create({ data });
  }

  public async deleteByUserId(userId: number) {
    return this.prisma.refreshTokenData.delete({
      where: { userId },
    });
  }

  public async findByUserId(userId: number): Promise<RefreshTokenData | null> {
    return this.prisma.refreshTokenData.findUnique({
      where: { userId },
    });
  }
}
