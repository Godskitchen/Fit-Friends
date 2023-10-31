import { BalanceRepository } from '@libs/database-service';
import { AccessTokenPayload, UpdateBalanceData } from '@libs/shared/app-types';
import { BalanceErrors } from '@libs/shared/common';
import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import uuidValidate from 'uuid-validate';

@Injectable()
export class ModifyBalanceGuard implements CanActivate {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  async canActivate(cxt: ExecutionContext) {
    const { user, body } = cxt.switchToHttp().getRequest<Request>();

    const userId = (user as AccessTokenPayload).sub;
    const balanceId = (body as UpdateBalanceData).balanceId;

    if (!uuidValidate(balanceId)) {
      throw new BadRequestException(BalanceErrors.INCORRECT_BALANCE_ID_TYPE);
    }
    const existBalance = await this.balanceRepository.findById(balanceId);

    if (!existBalance) {
      throw new BadRequestException(BalanceErrors.BALANCE_NOT_FOUND);
    }

    if (existBalance.userId !== userId) {
      throw new ForbiddenException(BalanceErrors.MODIFY_BALANCE_FORBIDDEN);
    }
    return true;
  }
}
