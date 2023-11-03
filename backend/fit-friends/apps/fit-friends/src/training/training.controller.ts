import { RequestWithAccessTokenPayload, Role } from '@libs/shared/app-types';
import { Roles } from '@libs/shared/common';
import {
  JwtAccessGuard,
  ModifyTrainingGuard,
  RoleGuard,
} from '@libs/shared/guards';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { NewTrainingDto } from './dto/new-training.dto';
import { TrainingService } from './training.service';
import { fillRDO } from '@libs/shared/helpers';
import { TrainingRdo } from './rdo/training.rdo';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { UserTrainingsQuery } from './queries/user-training.query';
import { GeneralTrainingQuery } from './queries/general-training.query';

@UseGuards(JwtAccessGuard)
@Controller('/trainings')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('/create')
  @Roles(Role.Trainer)
  @UseGuards(RoleGuard)
  public async createTraining(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: NewTrainingDto,
    @Req() { user }: RequestWithAccessTokenPayload,
  ) {
    const newTraining = await this.trainingService.create(dto, user.sub);
    return fillRDO(TrainingRdo, newTraining, [Role.Trainer]);
  }

  @Get('/details/:trainingId')
  public async getTrainingDetails(
    @Param('trainingId', ParseIntPipe) id: number,
  ) {
    const training = await this.trainingService.getById(id);
    return fillRDO(TrainingRdo, training, [Role.Trainer]);
  }

  @Patch('/update/:trainingId')
  @Roles(Role.Trainer)
  @UseGuards(RoleGuard, ModifyTrainingGuard)
  public async updateTrainingInfo(
    @Param('trainingId', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: UpdateTrainingDto,
  ) {
    const training = await this.trainingService.update(dto, id);
    return fillRDO(TrainingRdo, training, [Role.Trainer]);
  }

  @Get('/')
  public async getTrainingsCatalog(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: GeneralTrainingQuery,
  ) {
    const trainingList = await this.trainingService.getAll(query);
    return fillRDO(TrainingRdo, trainingList, [Role.Trainer]);
  }

  @Get('/mylist')
  @Roles(Role.Trainer)
  @UseGuards(RoleGuard)
  public async getTrainerTrainingsList(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: UserTrainingsQuery,
  ) {
    const trainingList = await this.trainingService.getByTrainerId(
      user.sub,
      query,
    );
    return fillRDO(TrainingRdo, trainingList, [Role.Trainer]);
  }
}
