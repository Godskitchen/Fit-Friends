import { OrderType } from '../order-type.enum';
import { PaymentType } from '../payment-type.enum';

export interface Order {
  readonly orderId: string;
  orderType: OrderType;
  trainingId: number;
  price: number;
  trainingCount: number;
  sum: number;
  paymentType: PaymentType;
  createdAt?: Date;
}
