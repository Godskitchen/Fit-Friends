import { OrderType, PaymentType } from '../..';

export interface Order {
  readonly orderId: string;
  orderType: OrderType;
  trainingId: number;
  price: number;
  trainingCount: number;
  sum: number;
  paymentType: PaymentType;
  customerId: number;
  createdAt?: Date;
}
