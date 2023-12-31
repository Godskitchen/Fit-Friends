import { TrainingRequestRepository } from '@libs/database-service';
import {
  AccessTokenPayload,
  TrainingRequestData,
  TrainingRequestStatus,
} from '@libs/shared/app-types';
import { TrainingRequestErrors } from '@libs/shared/common';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import uuidValidate from 'uuid-validate';

@Injectable()
export class ModifyRequestStatusGuard implements CanActivate {
  constructor(private readonly requestRepository: TrainingRequestRepository) {}
  async canActivate(cxt: ExecutionContext) {
    const { body, user } = cxt.switchToHttp().getRequest<Request>();
    const payload = user as AccessTokenPayload;
    const { status, id } = body as TrainingRequestData;

    if (!uuidValidate(id)) {
      throw new BadRequestException(
        TrainingRequestErrors.INCORRECT_REQUEST_ID_TYPE,
      );
    }

    const trainingRequest = await this.requestRepository.findById(id);

    if (!trainingRequest) {
      throw new BadRequestException(
        TrainingRequestErrors.TRAINING_REQUEST_NOT_FOUND,
      );
    }

    if (
      trainingRequest.status !== TrainingRequestStatus.Pending ||
      trainingRequest.recepientId !== payload.sub
    ) {
      throw new ForbiddenException(
        TrainingRequestErrors.MODIFY_REQUEST_FORBIDDEN,
      );
    }

    if (status === TrainingRequestStatus.Pending) {
      throw new BadRequestException(
        TrainingRequestErrors.INCORRECT_REQUEST_STATUS,
      );
    }

    return true;
  }
}
