import { BalanceRepository, TrainingRepository } from '@libs/database-service';
import { AccessTokenPayload, CreateBalanceData } from '@libs/shared/app-types';
import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { BalanceErrors, TrainingErrors } from '@libs/shared/common';

@Injectable()
export class CreateBalanceGuard implements CanActivate {
  constructor(
    private readonly balanceRepository: BalanceRepository,
    private readonly trainingRepository: TrainingRepository,
  ) {}

  async canActivate(cxt: ExecutionContext) {
    const { user, body } = cxt.switchToHttp().getRequest<Request>();

    const userId = (user as AccessTokenPayload).sub;
    const trainingId = (body as CreateBalanceData).trainingId;
    if (!Number.isInteger(trainingId) || trainingId <= 0) {
      throw new BadRequestException(TrainingErrors.INCORRECT_TRAINING_ID_TYPE);
    }

    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new BadRequestException(TrainingErrors.TRAINING_NOT_FOUND);
    }

    const existBalance = await this.balanceRepository.findExist(
      userId,
      trainingId,
    );

    if (existBalance) {
      throw new ConflictException(BalanceErrors.BALANCE_ALREADY_EXISTS);
    }
    return true;
  }
}
