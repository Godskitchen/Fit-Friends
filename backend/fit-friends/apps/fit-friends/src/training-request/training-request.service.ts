import { MessageService } from '@app/message';
import { TrainingRequestRepository } from '@libs/database-service';
import { TrainingRequestEntity } from '@libs/database-service/lib/entities/training-request.entity';
import { Role, TrainingRequestStatus } from '@libs/shared/app-types';
import { Injectable } from '@nestjs/common';
import { UpdateStatusDto } from './dto/update-status.dto';
import {
  createAnsweredTrainingRequestMessage,
  createTrainingRequestMessage,
} from '@libs/shared/helpers';

@Injectable()
export class TrainingRequestService {
  constructor(
    private readonly requestRepository: TrainingRequestRepository,
    private readonly messageService: MessageService,
  ) {}

  public async createRequest(
    senderId: number,
    senderName: string,
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
      text: createTrainingRequestMessage(senderName),
    });

    return request;
  }

  public async updateStatus(
    { status, id }: UpdateStatusDto,
    senderName: string,
    senderRole: Role,
  ) {
    const updatedRequest = await this.requestRepository.update(status, id);

    await this.messageService.createMessage({
      recepientId: updatedRequest.senderId,
      text: createAnsweredTrainingRequestMessage(
        senderName,
        senderRole,
        status,
      ),
    });

    return updatedRequest;
  }
}
