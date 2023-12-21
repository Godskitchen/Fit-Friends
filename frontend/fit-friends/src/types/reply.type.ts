import { UserInfo } from './user.type';

export type Reply = {
  replyId: number;
  text: string;
  rating: number;
  author: UserInfo;
}

export type ReplyList = {
  replyList: Reply[];
  totalRepliesCount: number;
}
