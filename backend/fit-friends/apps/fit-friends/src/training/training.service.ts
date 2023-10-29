import {
  TrainingEntity,
  TrainingRepository,
  UserRepository,
} from '@libs/database-service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NewTrainingDto } from './dto/new-training.dto';
import { TRAINING_NOT_FOUND, USER_NOT_FOUND } from '@libs/shared/common';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingQuery } from './queries/training.query';
import { StaticService } from '@app/static';
import { BackgroundImageType } from '@libs/shared/app-types';

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
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const { video: videoPath } = dto;

    const entity = new TrainingEntity({
      ...dto,
      backgroundImage: await this.staticService.getDefaultBackgroundImage(
        BackgroundImageType.trainings,
      ),
      video: (await this.staticService.getFile(videoPath)) ?? '',
      rating: 0,
      trainer: existTrainer,
    });

    return await this.trainingRepository.create(entity);
  }

  public async getById(id: number) {
    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundException(TRAINING_NOT_FOUND);
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

  public async getByTrainerId(id: number, query: TrainingQuery) {
    return this.trainingRepository.findByTrainerId(id, query);
  }
}
