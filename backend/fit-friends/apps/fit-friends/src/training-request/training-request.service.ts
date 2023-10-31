import { MessageService } from '@app/message';
import { TrainingRequestRepository } from '@libs/database-service';
import { TrainingRequestEntity } from '@libs/database-service/lib/entities/training-request.entity';
import { TrainingRequestStatus } from '@libs/shared/app-types';
import { Injectable } from '@nestjs/common';
import { UpdateStatusDto } from './dto/update-status.dto';
import { createTrainingRequestMessage } from '@libs/shared/helpers';

@Injectable()
export class TrainingRequestService {
  constructor(
    private readonly requestRepository: TrainingRequestRepository,
    private readonly messageService: MessageService,
  ) {}

  public async createRequest(
    senderId: number,
    userName: string,
    recepientId: number,
  ) {
    const request = await this.requestRepository.create(
      new TrainingRequestEntity({
        senderId,
        recepientId,
        status: TrainingRequestStatus.Pending,
      }),
    );

    await this.messageService.createMessage({
      recepientId,
      text: createTrainingRequestMessage(userName),
    });

    return request;
  }

  public async updateStatus({ status, requestId }: UpdateStatusDto) {
    return this.requestRepository.update(status, requestId);
  }
}
