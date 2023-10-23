import { RequestWithAccessTokenPayload, Role } from '@libs/shared/app-types';
import { Roles } from '@libs/shared/common';
import { JwtAccessGuard, RoleGuard } from '@libs/shared/guards';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { NewTrainingDto } from './dto/new-training.dto';
import { TrainingService } from './training.service';
import { fillRDO } from '@libs/shared/helpers';
import { TrainingRdo } from './rdo/training.rdo';

@Controller('/trainings')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('/')
  @Roles(Role.Trainer)
  @UseGuards(JwtAccessGuard, RoleGuard)
  public async createTraining(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: NewTrainingDto,
    @Req() { user }: RequestWithAccessTokenPayload,
  ) {
    const newTraining = await this.trainingService.create(dto, user.sub);
    console.log(newTraining);
  }

  @Get('/:trainingId')
  @UseGuards(JwtAccessGuard)
  public async getTrainingDetails(
    @Param('trainingId', ParseIntPipe) id: number,
  ) {
    const training = await this.trainingService.getById(id);
    return fillRDO(TrainingRdo, training, [Role.Trainer]);
  }

  @Patch('/:trainingId')
  @UseGuards(JwtAccessGuard)
  public async updateTrainingInfo(@Param('trainingId', ParseIntPipe) id: number,) {
    
  }
}
