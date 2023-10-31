import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/database.service';
import { UserBalanceEntity } from '../entities/user-balance.entity';
import {
  BaseQuery,
  UpdateBalanceData,
  UserBalance,
} from '@libs/shared/app-types';

@Injectable()
export class BalanceRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(item: UserBalanceEntity): Promise<UserBalance> {
    const { userId, trainingId, remainingAmount } = item.toObject();

    return this.prismaConnector.userBalance.create({
      data: {
        remainingAmount,
        user: { connect: { userId } },
        training: { connect: { trainingId } },
      },
      include: { training: true },
    });
  }

  public async update({
    balanceId,
    remainingAmount,
  }: UpdateBalanceData): Promise<UserBalance> {
    return this.prismaConnector.userBalance.update({
      where: { balanceId },
      data: { remainingAmount },
      include: { training: true },
    });
  }

  public async findAllByUserId(
    userId: number,
    { limit, page, sortDirection }: BaseQuery,
  ): Promise<UserBalance[]> {
    return this.prismaConnector.userBalance.findMany({
      where: { userId },
      include: { training: true },
      take: limit,
      skip: page ? limit * (page - 1) : undefined,
      orderBy: { createdAt: sortDirection },
    });
  }

  public async findExist(
    userId: number,
    trainingId: number,
  ): Promise<UserBalance | null> {
    return this.prismaConnector.userBalance.findUnique({
      where: {
        userId_trainingId: {
          userId,
          trainingId,
        },
      },
    });
  }

  public async findById(balanceId: string) {
    return this.prismaConnector.userBalance.findUnique({
      where: { balanceId },
    });
  }
}
