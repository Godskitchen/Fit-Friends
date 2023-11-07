import { RequestWithAccessTokenPayload } from '@libs/shared/app-types';
import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { fillRDO } from '@libs/shared/helpers';
import { MessageRdo } from './rdo/message.rdo';
import { JwtAccessGuard, MessageGuard } from '@libs/shared/guards';
import { MESSAGE_DELETED } from './constants';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('messages')
@ApiTags('messages')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Пользователь неавторизован' })
@UseGuards(JwtAccessGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOkResponse({
    description:
      'Получен список последних пяти системных сообщений: Добавление в друзья или заявка на тренировку',
    type: [MessageRdo],
  })
  @Get('/')
  public async getUserMessages(@Req() { user }: RequestWithAccessTokenPayload) {
    const messages = await this.messageService.getUserMessages(user.sub);
    return fillRDO(MessageRdo, messages);
  }

  @ApiOkResponse({
    description: 'Сообщение успешно удалено',
  })
  @ApiBadRequestResponse({
    description: 'Сообщения с указанным id не существует',
  })
  @ApiForbiddenResponse({
    description: 'Нельзя удалять сообщения другого пользователя',
  })
  @ApiParam({ name: 'messageId', description: 'id сообщения' })
  @Delete('/:messageId')
  @UseGuards(MessageGuard)
  public async deleteUserMessage(@Param('messageId') messageId: string) {
    await this.messageService.deleteMessage(messageId);
    return { message: MESSAGE_DELETED };
  }
}
