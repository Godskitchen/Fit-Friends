import {
  TrainingEntity,
  TrainingRepository,
  UserRepository,
} from '@libs/database-service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NewTrainingDto } from './dto/new-training.dto';
import { TRAINING_NOT_FOUND, USER_NOT_FOUND } from '@libs/shared/common';

@Injectable()
export class TrainingService {
  constructor(
    private readonly trainingRepository: TrainingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async create(dto: NewTrainingDto, trainerId: number) {
    const existTrainer = await this.userRepository.findById(trainerId);
    if (!existTrainer) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    const entity = new TrainingEntity({
      ...dto,
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
}
