import { User } from './user.interface';

export interface Notification {
  notificationId: number;
  recipient: User;
  text: string;
  createdAt?: Date;
}
