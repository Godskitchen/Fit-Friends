import {
  TrainingEntity,
  TrainingRepository,
  UserRepository,
} from '@libs/database-service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NewTrainingDto } from './dto/new-training.dto';
import { TrainingErrors, UserErrors } from '@libs/shared/common';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { UserTrainingsQuery } from './queries/user-training.query';
import { StaticService } from '@app/static';
import { BackgroundImageType } from '@libs/shared/app-types';
import { GeneralTrainingQuery } from './queries/general-training.query';

@Injectable()
export class TrainingService {
  constructor(
    private readonly staticService: StaticService,
    private readonly trainingRepository: TrainingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async create(dto: NewTrainingDto, trainerId: number) {
    const existTrainer = await this.userRepository.findById(trainerId);
    if (!existTrainer) {
      throw new NotFoundException(UserErrors.USER_NOT_FOUND);
    }

    const { video: videoPath } = dto;

    const entity = new TrainingEntity({
      ...dto,
      backgroundImage: await this.staticService.getDefaultBackgroundImage(
        BackgroundImageType.trainings,
      ),
      video: await this.staticService.getFile(videoPath),
      trainer: existTrainer,
    });

    return await this.trainingRepository.create(entity);
  }

  public async getById(id: number) {
    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundException(TrainingErrors.TRAINING_NOT_FOUND);
    }

    return training;
  }

  public async update(dto: UpdateTrainingDto, id: number) {
    const { video: videoPath } = dto;
    return this.trainingRepository.update(
      {
        ...dto,
        video: videoPath
          ? await this.staticService.getFile(videoPath)
          : undefined,
      },
      id,
    );
  }

  public async getByTrainerId(id: number, query: UserTrainingsQuery) {
    return this.trainingRepository.findByTrainerId(id, query);
  }

  public async getAll(query: GeneralTrainingQuery) {
    return this.trainingRepository.findAll(query);
  }
}
