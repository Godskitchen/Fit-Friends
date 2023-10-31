import { Reply } from '@libs/shared/app-types';

export class ReplyEntity implements Omit<Reply, 'replyId'> {
  authorId: number;
  trainingId: number;
  rating: number;
  text: string;
  createdAt?: Date;

  constructor(reply: Omit<Reply, 'replyId'>) {
    this.authorId = reply.authorId;
    this.trainingId = reply.trainingId;
    this.rating = reply.rating;
    this.text = reply.text;
  }

  toObject() {
    return {
      authorId: this.authorId,
      trainingId: this.trainingId,
      rating: this.rating,
      text: this.text,
    };
  }
}
