import { BalanceRepository } from '@libs/database-service';
import { AccessTokenPayload, UpdateBalanceData } from '@libs/shared/app-types';
import {
  BALANCE_NOT_FOUND,
  MODIFY_BALANCE_FORBIDDEN,
} from '@libs/shared/common';
import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class ModifyBalanceGuard implements CanActivate {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async canActivate(cxt: ExecutionContext) {
    const { user, body } = cxt.switchToHttp().getRequest<Request>();

    const userId = (user as AccessTokenPayload).sub;
    const balanceId = (body as UpdateBalanceData).balanceId;
// Argument `balanceId`: Invalid value provided. Expected String, provided Int.
    const existBalance = await this.balanceRepository.findById(balanceId);

    if (!existBalance) {
      throw new BadRequestException(BALANCE_NOT_FOUND);
    }

    if (existBalance.userId !== userId) {
      throw new ForbiddenException(MODIFY_BALANCE_FORBIDDEN);
    }
    return true;
  }
}
