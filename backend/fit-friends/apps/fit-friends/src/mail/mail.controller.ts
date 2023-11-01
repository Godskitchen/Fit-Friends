import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { RequestWithAccessTokenPayload, Role } from '@libs/shared/app-types';
import {
  JwtAccessGuard,
  RoleGuard,
  SubscriptionGuard,
} from '@libs/shared/guards';
import { Roles } from '@libs/shared/common';
import {
  createAddSubscriptionMessage,
  createRemoveSubscriptionMessage,
} from '@libs/shared/helpers';

@Controller('subscriptions')
@UseGuards(JwtAccessGuard, RoleGuard, SubscriptionGuard)
export class MailController {
  constructor(private readonly mailservice: MailService) {}

  @Post('/add/:trainerId')
  @Roles(Role.User)
  public async subscribeToTrainer(
    @Param('trainerId', ParseIntPipe) trainerId: number,
    @Req() { user }: RequestWithAccessTokenPayload,
  ) {
    await this.mailservice.addSubscription(user.email, trainerId);
    return { message: createAddSubscriptionMessage(trainerId) };
  }

  @Delete('/remove/:trainerId')
  @Roles(Role.User)
  public async unsubscribeToTrainer(
    @Param('trainerId', ParseIntPipe) trainerId: number,
    @Req() { user }: RequestWithAccessTokenPayload,
  ) {
    await this.mailservice.removeSubscription(user.email, trainerId);
    return { message: createRemoveSubscriptionMessage(trainerId) };
  }
}
