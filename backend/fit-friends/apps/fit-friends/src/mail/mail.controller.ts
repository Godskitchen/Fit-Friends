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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('subscriptions')
@ApiTags('subscriptions')
@ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' })
@ApiForbiddenResponse({
  description: 'Оформлять подписку могу только обычные пользователи',
})
@UseGuards(JwtAccessGuard, RoleGuard, SubscriptionGuard)
export class MailController {
  constructor(private readonly mailservice: MailService) {}

  @ApiOkResponse({ description: 'Подписка на тренера успешно оформлена' })
  @ApiBadRequestResponse({
    description:
      'Тренер с выбранным id не найден. Пользователь с выбранным id не является тренером.',
  })
  @ApiConflictResponse({
    description: 'Подписка на данного тренера уже оформлена',
  })
  @ApiParam({
    name: 'trainerId',
    description: 'id тренера - целое положительное число',
  })
  @Post('/add/:trainerId')
  @Roles(Role.User)
  public async subscribeToTrainer(
    @Param('trainerId', ParseIntPipe) trainerId: number,
    @Req() { user }: RequestWithAccessTokenPayload,
  ) {
    await this.mailservice.addSubscription(user.email, trainerId);
    return { message: createAddSubscriptionMessage(trainerId) };
  }

  @ApiOkResponse({ description: 'Подписка на тренера успешно удалена' })
  @ApiBadRequestResponse({
    description:
      'Тренер с выбранным id не найден. Пользователь с выбранным id не является тренером. Подписка на тренера ранее не оформлялась',
  })
  @ApiParam({
    name: 'trainerId',
    description: 'id тренера - целое положительное число',
  })
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
