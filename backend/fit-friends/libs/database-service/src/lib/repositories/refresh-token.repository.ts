import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../prisma/database.service';
import { RefreshTokenDataEntity } from '../entities/refresh-token-data.entity';
import { RefreshTokenData } from '@libs/shared/app-types';

@Injectable()
export class RefreshTokenRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(item: RefreshTokenDataEntity): Promise<RefreshTokenData> {
    const data = item.toObject();
    return this.prismaConnector.refreshTokenData.create({ data });
  }

  public async deleteByUserId(userId: number) {
    return this.prismaConnector.refreshTokenData.delete({
      where: { userId },
    });
  }

  public async findByUserId(userId: number): Promise<RefreshTokenData | null> {
    return this.prismaConnector.refreshTokenData.findUnique({
      where: { userId },
    });
  }
}
