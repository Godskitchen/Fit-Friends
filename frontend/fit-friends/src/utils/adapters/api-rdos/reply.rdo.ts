import { UserRdo } from './user.rdo';

export type ReplyRdo = {
  replyId: number;
  text: string;
  author: UserRdo;
  rating: number;
  createdAt: Date;
}

export type ReplyListRdo = {
  replyList: ReplyRdo[];
  totalRepliesCount: number;
}
