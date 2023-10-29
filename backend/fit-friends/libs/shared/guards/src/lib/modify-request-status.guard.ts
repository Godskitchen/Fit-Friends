import { TrainingRequestRepository } from '@libs/database-service';
import {
  AccessTokenPayload,
  TrainingRequestData,
} from '@libs/shared/app-types';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ModifyRequestStatusGuard implements CanActivate {
  constructor(private readonly requestRepository: TrainingRequestRepository) {}
  async canActivate(cxt: ExecutionContext) {
    const { body, user } = cxt.switchToHttp().getRequest<Request>();
    const payload = user as AccessTokenPayload;
    const { status, requestId } = body as TrainingRequestData;
    return true;
  }
}
