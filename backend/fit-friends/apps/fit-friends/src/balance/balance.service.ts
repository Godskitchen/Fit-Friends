import { Injectable } from '@nestjs/common';
import { BalanceRepository } from '@libs/database-service';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { BalanceQuery } from './queries/balance.query';

@Injectable()
export class BalanceService {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  public async update(dto: UpdateBalanceDto) {
    return this.balanceRepository.update({ ...dto });
  }

  public async getUserBalance(userId: number, query: BalanceQuery) {
    return this.balanceRepository.findAllByUserId(userId, query);
  }
}
