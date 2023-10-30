import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/database.service';
import { TrainingRequest, TrainingRequestStatus } from '@libs/shared/app-types';
import { TrainingRequestEntity } from '../entities/training-request.entity';

@Injectable()
export class TrainingRequestRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(item: TrainingRequestEntity): Promise<TrainingRequest> {
    const { senderId, recepientId, status } = item.toObject();

    return this.prismaConnector.trainingRequest.create({
      data: {
        status,
        sender: { connect: { userId: senderId } },
        recepient: { connect: { userId: recepientId } },
      },
    });
  }

  public async update(
    status: TrainingRequestStatus,
    id: string,
  ): Promise<TrainingRequest> {
    return this.prismaConnector.trainingRequest.update({
      where: { id },
      data: { status },
    });
  }

  public async findAllByRecepientId(
    recepientId: number,
  ): Promise<TrainingRequest[]> {
    return this.prismaConnector.trainingRequest.findMany({
      where: { recepientId },
    });
  }

  public async findById(requestId: string): Promise<TrainingRequest | null> {
    return this.prismaConnector.trainingRequest.findUnique({
      where: { id: requestId },
    });
  }

  public findPending(
    senderId: number,
    recepientId: number,
  ): Promise<TrainingRequest | null> {
    return this.prismaConnector.trainingRequest.findFirst({
      where: {
        senderId,
        recepientId,
        status: TrainingRequestStatus.Pending,
      },
    });
  }
}
