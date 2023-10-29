import { Message } from '@libs/shared/app-types';

export class MessageEntity implements Omit<Message, 'id'> {
  recepientId: number;
  text: string;

  constructor(message: Omit<Message, 'id'>) {
    this.recepientId = message.recepientId;
    this.text = message.text;
  }

  toObject() {
    return {
      recepientId: this.recepientId,
      text: this.text,
    };
  }
}
