export interface Message {
  id: string;
  recepientId: number;
  text: string;
  createdAt?: Date;
}
