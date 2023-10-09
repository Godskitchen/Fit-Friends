import { Training } from './training.interface';
import { User } from './user.interface';

export interface Review {
  readonly reviewId: number;
  author: User;
  training: Training;
  rating: number;
  text: string;
  createdAt?: Date;
}
