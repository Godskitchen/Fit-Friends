import { MessageEntity, MessageRepository } from '@libs/database-service';
import { MessageData } from '@libs/shared/app-types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  public async getUserMessages(userId: number) {
    return this.messageRepository.findByUserId(userId);
  }

  public async createMessage(data: MessageData) {
    return this.messageRepository.create(new MessageEntity(data));
  }

  public async deleteMessage(messageId: string) {
    return this.messageRepository.delete(messageId);
  }
}
