import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TrainingRequestService } from './training-request.service';
import { RequestWithAccessTokenPayload, Role } from '@libs/shared/app-types';
import {
  CreateRequestGuard,
  JwtAccessGuard,
  ModifyRequestStatusGuard,
  RoleGuard,
} from '@libs/shared/guards';
import { Roles } from '@libs/shared/common';
import {
  createNewRequestMessage,
  createUpdateStatusMessage,
} from './constants';
import { UpdateStatusDto } from './dto/update-status.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('training-requests')
@ApiTags('training-requests')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Пользователь неавторизован',
})
@UseGuards(JwtAccessGuard)
export class TrainingRequestController {
  constructor(
    private readonly trainingRequestService: TrainingRequestService,
  ) {}

  @ApiOkResponse({
    description: 'Заявка на тренировку успешно отправлена другу.',
  })
  @Post('/create/:recepientId')
  @ApiBadRequestResponse({
    description:
      'Невозможно отправить заявку самому себе. Получатель с указанным id не существует. Получатель не в друзьях у отправителя. Получатель не готов к тренировкам. Получатель ещё не ответил на последнюю заявку',
  })
  @ApiForbiddenResponse({
    description:
      'Отправлять заявки на тренировку могут только обычные пользователи.',
  })
  @ApiParam({
    name: 'recepientId',
    description: 'id получателя - целое положительное число',
  })
  @UseGuards(RoleGuard, CreateRequestGuard)
  @Roles(Role.User)
  public async createRequest(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Param('recepientId', ParseIntPipe) recepientId: number,
  ) {
    const request = await this.trainingRequestService.createRequest(
      user.sub,
      user.name,
      recepientId,
    );

    return {
      message: createNewRequestMessage(request),
    };
  }

  @ApiOkResponse({
    description: 'Полученная заявка на тренировку отклонена или принята.',
  })
  @ApiBadRequestResponse({
    description:
      'Заявка с выбранным id не найдена. Передан некорректный новый статус заявки.',
  })
  @ApiForbiddenResponse({
    description:
      'Нельзя изменить статус заявки, отправленной другому пользователю.',
  })
  @Patch('/update')
  @UseGuards(ModifyRequestStatusGuard)
  public async updateStatusRequest(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: UpdateStatusDto,
  ) {
    const request = await this.trainingRequestService.updateStatus(dto);
    return {
      message: createUpdateStatusMessage(request),
    };
  }
}
