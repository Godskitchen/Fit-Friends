import { TrainingRepository } from '@libs/database-service';
import { AccessTokenPayload } from '@libs/shared/app-types';
import { TrainingErrors } from '@libs/shared/common';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ModifyTrainingGuard implements CanActivate {
  constructor(private readonly trainingRepository: TrainingRepository) {}

  async canActivate(cxt: ExecutionContext) {
    const {
      params: { trainingId },
      user,
    } = cxt.switchToHttp().getRequest<Request>();
    const payload = user as AccessTokenPayload;

    const training = await this.trainingRepository.findById(+trainingId);

    if (!training) {
      throw new NotFoundException(TrainingErrors.TRAINING_NOT_FOUND);
    }

    if (training.trainer.userId !== +payload.sub)
      throw new ForbiddenException(TrainingErrors.INCORRECT_TRAINING_OWNER);

    return true;
  }
}
