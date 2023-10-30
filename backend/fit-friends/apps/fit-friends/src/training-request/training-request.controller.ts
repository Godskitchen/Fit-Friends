import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
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
import { createNewRequestMessage } from './constants';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('training-requests')
@UseGuards(JwtAccessGuard)
export class TrainingRequestController {
  constructor(
    private readonly trainingRequestService: TrainingRequestService,
  ) {}

  @Post('/create/:recepientId')
  @UseGuards(RoleGuard, CreateRequestGuard)
  @Roles(Role.User)
  public async createRequest(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Param('recepientId', ParseIntPipe) recepientId: number,
  ) {
    await this.trainingRequestService.createRequest(
      user.sub,
      user.name,
      recepientId,
    );

    return {
      message: createNewRequestMessage(recepientId),
    };
  }

  @Patch('/update')
  @UseGuards(ModifyRequestStatusGuard)
  public async updateStatusRequest(@Body() dto: UpdateStatusDto) {
    await this.trainingRequestService.updateStatus(dto);
  }
}
