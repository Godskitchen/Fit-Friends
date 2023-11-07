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
import {
  MAX_ITEMS_LIMIT,
  RequestWithAccessTokenPayload,
  Role,
} from '@libs/shared/app-types';
import { NewReplyDto } from './dto/new-reply.dto';
import { fillRDO } from '@libs/shared/helpers';
import { ReplyRdo } from './rdo/reply.rdo';
import { ReplyQuery } from './queries/reply.query';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('replies')
@ApiTags('replies')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Пользователь неавторизован',
})
@UseGuards(JwtAccessGuard)
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post('/create')
  @ApiCreatedResponse({
    description:
      'Отзыв о тренировке успешно создан. Получена информация об отзыве.',
    type: ReplyRdo,
  })
  @ApiBadRequestResponse({
    description:
      'Не пройдены поля валидации DTO. Тренировка с выбранным id не найдена',
  })
  @ApiForbiddenResponse({
    description:
      'Оставлять отзывы могут только обычные пользователи, которые приобретали тренировку',
  })
  @ApiConflictResponse({
    description: 'Отзыв к тренировке уже был оставлен пользователем ранее',
  })
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

  @ApiOkResponse({
    description: `Получен список отзывов к тренировке. По умолчанию возвращается ${MAX_ITEMS_LIMIT} отзывов`,
    type: [ReplyRdo],
  })
  @ApiParam({
    name: 'trainingId',
    description: 'id тренировки - целое положительное число',
  })
  @ApiBadRequestResponse({
    description: 'Тренировка с выбранным id не существует',
  })
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
