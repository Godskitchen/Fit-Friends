import { RequestWithAccessTokenPayload } from '@libs/shared/app-types';
import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { fillRDO } from '@libs/shared/helpers';
import { MessageRdo } from './rdo/message.rdo';
import { JwtAccessGuard, MessageGuard } from '@libs/shared/guards';
import { MESSAGE_DELETED } from './constants';

@Controller('messages')
@UseGuards(JwtAccessGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/')
  public async getUserMessages(@Req() { user }: RequestWithAccessTokenPayload) {
    const messages = await this.messageService.getUserMessages(user.sub);
    return fillRDO(MessageRdo, messages);
  }

  @Delete('/:messageId')
  @UseGuards(MessageGuard)
  public async deleteUserMessage(@Param('messageId') messageId: string) {
    await this.messageService.deleteMessage(messageId);
    return { message: MESSAGE_DELETED };
  }
}
