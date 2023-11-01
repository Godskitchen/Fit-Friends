import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/database.service';
import dayjs from 'dayjs';

@Injectable()
export class SubscriberRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async createOrSubscribe(
    email: string,
    trainerId: number,
  ): Promise<void> {
    await this.prismaConnector.subscriber.upsert({
      where: { email },
      create: {
        email,
        subscribedTo: {
          connect: { userId: trainerId },
        },
      },
      update: {
        subscribedTo: {
          connect: { userId: trainerId },
        },
      },
    });
  }

  public async removeOrUnsubscribe(
    email: string,
    trainerId: number,
  ): Promise<void> {
    const subscriber = await this.prismaConnector.subscriber.update({
      where: { email },
      data: {
        subscribedTo: {
          disconnect: { userId: trainerId },
        },
      },
      include: {
        _count: {
          select: {
            subscribedTo: true,
          },
        },
      },
    });

    if (subscriber._count.subscribedTo === 0) {
      await this.prismaConnector.subscriber.delete({
        where: { email },
      });
    }
  }

  public async findByTrainerId(email: string, trainerId: number) {
    return this.prismaConnector.subscriber.findUnique({
      where: {
        email,
        subscribedTo: {
          some: { userId: trainerId },
        },
      },
    });
  }

  public async findAll() {
    return this.prismaConnector.subscriber.findMany({
      include: {
        subscribedTo: {
          include: {
            trainings: {
              where: {
                createdAt: { gt: dayjs().subtract(1, 'day').toDate() },
              },
            },
          },
        },
      },
    });
  }
}
