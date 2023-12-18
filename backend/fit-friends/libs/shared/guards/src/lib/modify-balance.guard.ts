import { BalanceRepository } from '@libs/database-service';
import { AccessTokenPayload, UpdateBalanceData } from '@libs/shared/app-types';
import { BalanceErrors } from '@libs/shared/common';
import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ModifyBalanceGuard implements CanActivate {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async canActivate(cxt: ExecutionContext) {
    const { user, body } = cxt.switchToHttp().getRequest<Request>();

    const userId = (user as AccessTokenPayload).sub;
    const trainingId = (body as UpdateBalanceData).trainingId;

    const existBalance = await this.balanceRepository.findExist(
      userId,
      trainingId,
    );

    if (!existBalance) {
      throw new BadRequestException(BalanceErrors.BALANCE_NOT_FOUND);
    }

    return true;
  }
}
