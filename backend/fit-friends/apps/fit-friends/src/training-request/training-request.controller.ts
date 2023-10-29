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
import { RoleGuard } from '@libs/shared/guards';
import { Roles } from '@libs/shared/common';
import { createNewRequestMessage } from './constants';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('training-requests')
export class TrainingRequestController {
  constructor(
    private readonly trainingRequestService: TrainingRequestService,
  ) {}

  @Post('/create/:recepientId')
  @UseGuards(RoleGuard)
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
  public async updateStatusRequest(@Body() dto: UpdateStatusDto) {
    await this.trainingRequestService.updateStatus(dto);
  }
}
