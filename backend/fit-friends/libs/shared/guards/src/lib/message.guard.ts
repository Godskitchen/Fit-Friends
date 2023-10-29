import { MessageRepository } from '@libs/database-service';
import { AccessTokenPayload } from '@libs/shared/app-types';
import {
  MESSAGE_NOT_FOUND,
  MODIFY_MESSAGE_FORBIDDEN,
} from '@libs/shared/common';
import {
  Injectable,
  CanActivate,
  Inject,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

Injectable();
export class MessageGuard implements CanActivate {
  constructor(
    @Inject(MessageRepository)
    private readonly messageRepository: MessageRepository,
  ) {}
  async canActivate(cxt: ExecutionContext) {
    const { user, params } = cxt.switchToHttp().getRequest<Request>();
    const userId = (user as AccessTokenPayload).sub;
    const messageId = params.messageId;

    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new BadRequestException(MESSAGE_NOT_FOUND);
    }

    if (message.recepientId !== userId) {
      throw new ForbiddenException(MODIFY_MESSAGE_FORBIDDEN);
    }

    return true;
  }
}
