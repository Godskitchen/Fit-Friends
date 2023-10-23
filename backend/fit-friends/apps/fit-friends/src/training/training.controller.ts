import { Role } from '@libs/shared/app-types';
import { Roles } from '@libs/shared/common';
import { JwtAccessGuard, RoleGuard } from '@libs/shared/guards';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { NewTrainingDto } from './dto/new-training.dto';

@Controller('/trainings')
export class TrainingController {
  @Post('/')
  @Roles(Role.Trainer)
  @UseGuards(JwtAccessGuard, RoleGuard)
  public async createTraining(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: NewTrainingDto,
  ) {}
}
