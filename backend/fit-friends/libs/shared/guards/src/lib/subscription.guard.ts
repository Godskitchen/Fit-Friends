import { SubscriberRepository, UserRepository } from '@libs/database-service';
import { AccessTokenPayload, Role } from '@libs/shared/app-types';
import { SubscriptionErrors, UserErrors } from '@libs/shared/common';
import {
  BadRequestException,
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

const ADD_SUBSCRIPTION_HANDLER = 'subscribeToTrainer';
const REMOVE_SUBSCRIPTION_HANDLER = 'unsubscribeToTrainer';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriberRepository,
  ) {}

  async canActivate(cxt: ExecutionContext) {
    const currentHandler = cxt.getHandler().name;
    const { user, params } = cxt.switchToHttp().getRequest<Request>();

    const { email } = user as AccessTokenPayload;
    const trainerId = +params.trainerId;

    if (!Number.isInteger(trainerId) || trainerId <= 0) {
      throw new BadRequestException(UserErrors.INCORRECT_USER_ID_TYPE);
    }

    const trainer = await this.userRepository.findById(trainerId);
    if (!trainer) {
      throw new BadRequestException(UserErrors.USER_NOT_FOUND);
    }

    if (trainer.role !== Role.Trainer) {
      throw new BadRequestException(SubscriptionErrors.BAD_SUBSCRIPTION_ROLE);
    }

    const existSubscription = await this.subscriptionRepository.findByTrainerId(
      email,
      trainerId,
    );

    if (existSubscription && currentHandler === ADD_SUBSCRIPTION_HANDLER) {
      throw new ConflictException(
        SubscriptionErrors.CONFLICT_ALREADY_SUBSCRIBED,
      );
    }

    if (!existSubscription && currentHandler === REMOVE_SUBSCRIPTION_HANDLER) {
      throw new BadRequestException(SubscriptionErrors.NOT_SUBSCRIBED);
    }

    return true;
  }
}
