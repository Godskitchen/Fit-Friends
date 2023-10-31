import {
  BalanceRepository,
  ReplyRepository,
  TrainingRepository,
} from '@libs/database-service';
import { AccessTokenPayload, ReplyData } from '@libs/shared/app-types';
import { TrainingErrors, ReplyErrors } from '@libs/shared/common';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CreateReplyGuard implements CanActivate {
  constructor(
    private readonly replyRepository: ReplyRepository,
    private readonly trainingRepository: TrainingRepository,
    private readonly balanceRepository: BalanceRepository,
  ) {}

  async canActivate(cxt: ExecutionContext) {
    const { user, body } = cxt.switchToHttp().getRequest<Request>();

    const userId = (user as AccessTokenPayload).sub;
    const trainingId = (body as ReplyData).trainingId;
    if (!Number.isInteger(trainingId) || trainingId <= 0) {
      throw new BadRequestException(TrainingErrors.INCORRECT_TRAINING_ID_TYPE);
    }

    const training = await this.trainingRepository.findById(trainingId);
    if (!training) {
      throw new BadRequestException(TrainingErrors.TRAINING_NOT_FOUND);
    }

    const existReply = await this.replyRepository.findExist(userId, trainingId);

    if (existReply) {
      throw new ConflictException(ReplyErrors.REPLY_ALREADY_EXISTS);
    }

    const existTrainingBalance = await this.balanceRepository.findExist(
      userId,
      trainingId,
    );

    if (!existTrainingBalance) {
      throw new ForbiddenException(ReplyErrors.CREATE_REPLY_FORBIDDEN);
    }

    return true;
  }
}
