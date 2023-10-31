import { ReplyRepository, TrainingRepository } from '@libs/database-service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewReplyDto } from './dto/new-reply.dto';
import { ReplyEntity } from '@libs/database-service/lib/entities/reply.entity';
import { REPLY_NOT_FOUND, TRAINING_NOT_FOUND } from '@libs/shared/common';
import { ReplyQuery } from './queries/reply.query';

@Injectable()
export class ReplyService {
  constructor(
    private readonly replyRepository: ReplyRepository,
    private readonly trainingRepository: TrainingRepository,
  ) {}

  public async createReply(dto: NewReplyDto, authorId: number) {
    return this.replyRepository.create(new ReplyEntity({ ...dto, authorId }));
  }

  public async getTrainingReplies(trainingId: number, query: ReplyQuery) {
    const existTraining = this.trainingRepository.findById(trainingId);
    if (!existTraining) {
      throw new BadRequestException(TRAINING_NOT_FOUND);
    }
    return this.replyRepository.findAllByTrainingId(trainingId, query);
  }

  public async getDetails(replyId: number) {
    const reply = await this.replyRepository.findById(replyId);
    if (!reply) {
      throw new NotFoundException(REPLY_NOT_FOUND);
    }
    return reply;
  }
}
