export interface Reply {
  replyId: number;
  authorId: number;
  trainingId: number;
  rating: number;
  text: string;
  createdAt?: Date;
}
