import {
  MAX_ITEMS_LIMIT,
  RequestWithAccessTokenPayload,
  Role,
} from '@libs/shared/app-types';
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TrainingListRdo } from './rdo/training-list.rdo';
import { SpecialTrainingQuery } from './queries/special-training.query';

@UseGuards(JwtAccessGuard)
@ApiTags('trainings')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Пользователь неавторизован',
})
@Controller('trainings')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('/create')
  @ApiCreatedResponse({
    description: 'Новая тренировка успешно создана',
    type: TrainingRdo,
  })
  @ApiBadRequestResponse({
    description: 'Не пройдена валидация полей DTO',
  })
  @ApiForbiddenResponse({
    description: 'Создание тренировки доступно только "тренерам"',
  })
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
  @ApiOkResponse({
    description: 'Получена информация о выбранной тренировке',
    type: TrainingRdo,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный id тренировки',
  })
  @ApiNotFoundResponse({
    description: 'Тренировка с таким id не найдена',
  })
  @ApiParam({
    name: 'trainingId',
    description: 'id тренировки - целое положительное число',
  })
  public async getTrainingDetails(
    @Param('trainingId', ParseIntPipe) id: number,
  ) {
    const training = await this.trainingService.getById(id);
    return fillRDO(TrainingRdo, training, [Role.Trainer]);
  }

  @Patch('/update/:trainingId')
  @ApiOkResponse({
    description: 'Получена обновленная информация о выбранной тренировке',
    type: TrainingRdo,
  })
  @ApiNotFoundResponse({
    description: 'Тренировка с таким id не найдена.',
  })
  @ApiBadRequestResponse({
    description: 'Некорректный id тренировки. Не пройдена валидация полей DTO',
  })
  @ApiForbiddenResponse({
    description: 'Нельзя изменять тренировку другого пользователя.',
  })
  @ApiParam({
    name: 'trainingId',
    description: 'id тренировки - целое положительное число',
  })
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
  @ApiOkResponse({
    description: `Получен список тренировок а также их общее количество без учета лимита. По умолчанию возвращается ${MAX_ITEMS_LIMIT} тренировок`,
    type: TrainingListRdo,
  })
  @ApiBadRequestResponse({
    description: 'Не пройдена валдиация полей query',
  })
  public async getTrainingsCatalog(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: GeneralTrainingQuery,
  ) {
    const trainingList = await this.trainingService.getAll(query);
    return fillRDO(TrainingListRdo, trainingList, [Role.Trainer]);
  }

  @Get('/mylist')
  @ApiOkResponse({
    description: `Получен список тренировок тренера а также их общее количество без учета лимита. По умолчанию возвращается ${MAX_ITEMS_LIMIT} тренировок`,
    type: TrainingListRdo,
  })
  @ApiBadRequestResponse({
    description: 'Не пройдена валдиация полей query',
  })
  @ApiForbiddenResponse({
    description: 'Маршрут доступен только "тренерам"',
  })
  @Roles(Role.Trainer)
  @UseGuards(RoleGuard)
  public async getMyTrainingsList(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: UserTrainingsQuery,
  ) {
    const trainingList = await this.trainingService.getByTrainerId(
      user.sub,
      query,
    );
    return fillRDO(TrainingListRdo, trainingList, [Role.Trainer]);
  }

  @Get('/specials')
  @ApiOkResponse({
    description: `Получена подборка тренировок в зависимости от предпочтений пользователя. По умолчанию возвращается ${MAX_ITEMS_LIMIT} тренировок`,
    type: [TrainingRdo],
  })
  @ApiBadRequestResponse({
    description: 'Не пройдена валдиация полей query',
  })
  @ApiForbiddenResponse({
    description: 'Маршрут доступен только "тренерам"',
  })
  @Roles(Role.User)
  @UseGuards(RoleGuard)
  public async getSpecialTrainingsList(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: SpecialTrainingQuery,
  ) {
    const trainingList = await this.trainingService.getSpecialTrainings(query);
    return fillRDO(TrainingRdo, trainingList);
  }
}
