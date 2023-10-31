import {
  CreateReplyGuard,
  JwtAccessGuard,
  RoleGuard,
} from '@libs/shared/guards';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { Roles } from '@libs/shared/common';
import { RequestWithAccessTokenPayload, Role } from '@libs/shared/app-types';
import { NewReplyDto } from './dto/new-reply.dto';
import { fillRDO } from '@libs/shared/helpers';
import { ReplyRdo } from './rdo/reply.rdo';
import { ReplyQuery } from './queries/reply.query';

@Controller('replies')
@UseGuards(JwtAccessGuard)
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post('/create')
  @UseGuards(RoleGuard, CreateReplyGuard)
  @Roles(Role.User)
  public async createReply(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    dto: NewReplyDto,
    @Req() { user }: RequestWithAccessTokenPayload,
  ) {
    const reply = await this.replyService.createReply(dto, user.sub);
    return fillRDO(ReplyRdo, reply, [Role.User]);
  }

  @Get('/list/:trainingId')
  public async getTrainingReplies(
    @Param('trainingId', ParseIntPipe) trainingId: number,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: ReplyQuery,
  ) {
    const replies = await this.replyService.getTrainingReplies(
      trainingId,
      query,
    );
    return fillRDO(ReplyRdo, replies, [Role.User]);
  }
}
