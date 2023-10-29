import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/database.service';
import { MessageEntity } from '../entities/message.entity';
import { Message } from '@libs/shared/app-types';

const SHOWED_MESSAGES_COUNT = 5;

@Injectable()
export class MessageRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(item: MessageEntity): Promise<Message> {
    const { recepientId, text } = item.toObject();
    return this.prismaConnector.message.create({
      data: { text, recepient: { connect: { userId: recepientId } } },
    });
  }

  public async findByUserId(userId: number): Promise<Message[]> {
    return this.prismaConnector.message.findMany({
      where: { recepientId: userId },
      take: SHOWED_MESSAGES_COUNT,
    });
  }

  public async findById(messageId: string): Promise<Message | null> {
    return this.prismaConnector.message.findUnique({
      where: { id: messageId },
    });
  }

  public async delete(messageId: string) {
    return this.prismaConnector.message.delete({
      where: { id: messageId },
    });
  }
}
