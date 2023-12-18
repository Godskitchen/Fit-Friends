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

  public async createOrUpdate(item: UserBalanceEntity): Promise<UserBalance> {
    const { userId, trainingId, remainingAmount } = item.toObject();

    return this.prismaConnector.userBalance.upsert({
      where: {
        userId_trainingId: { userId, trainingId },
      },
      create: {
        remainingAmount,
        user: { connect: { userId } },
        training: { connect: { trainingId } },
      },
      update: {
        remainingAmount: { increment: remainingAmount },
      },
      include: { training: true },
    });
  }

  public async update({
    userId,
    trainingId,
    remainingAmount,
  }: UpdateBalanceData): Promise<UserBalance> {
    return this.prismaConnector.userBalance.update({
      where: {
        userId_trainingId: {
          userId,
          trainingId,
        },
      },
      data: { remainingAmount },
      include: { training: true },
    });
  }

  public async findAllByUserId(
    userId: number,
    { limit, page, sortDirection, active }: BaseQuery,
  ) {
    const totalTrainingsCount = await this.prismaConnector.userBalance.count({
      where: {
        userId,
        remainingAmount: active === true ? { gt: 0 } : undefined,
      },
    });

    const balanceList = await this.prismaConnector.userBalance.findMany({
      where: {
        userId,
        remainingAmount: active === true ? { gt: 0 } : undefined,
      },
      include: { training: true },
      take: limit,
      skip: page ? limit * (page - 1) : undefined,
      orderBy: { createdAt: sortDirection },
    });

    return { balanceList, totalTrainingsCount };
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
