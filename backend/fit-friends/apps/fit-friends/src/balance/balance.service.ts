import { Injectable } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { BalanceRepository, UserBalanceEntity } from '@libs/database-service';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { BalanceQuery } from './queries/balance.query';

@Injectable()
export class BalanceService {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  public async create(userId: number, dto: CreateBalanceDto) {
    return this.balanceRepository.create(
      new UserBalanceEntity({ userId, ...dto }),
    );
  }

  public async update(dto: UpdateBalanceDto) {
    return this.balanceRepository.update({ ...dto });
  }

  public async getUserBalance(userId: number, query: BalanceQuery) {
    return this.balanceRepository.findAllByUserId(userId, query);
  }
}
