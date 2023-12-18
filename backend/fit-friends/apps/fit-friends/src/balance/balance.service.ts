import { Injectable } from '@nestjs/common';
import { BalanceRepository } from '@libs/database-service';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { BalanceQuery } from './queries/balance.query';

@Injectable()
export class BalanceService {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  public async update(userId: number, dto: UpdateBalanceDto) {
    return this.balanceRepository.update({ ...dto, userId });
  }

  public async getUserBalance(userId: number, query: BalanceQuery) {
    return this.balanceRepository.findAllByUserId(userId, query);
  }

  public async getTrainingRemainingAmount(userId: number, trainingId: number) {
    const existTrainingBalance = await this.balanceRepository.findExist(
      userId,
      trainingId,
    );

    if (!existTrainingBalance) {
      return -1;
    }

    return existTrainingBalance.remainingAmount;
  }
}
