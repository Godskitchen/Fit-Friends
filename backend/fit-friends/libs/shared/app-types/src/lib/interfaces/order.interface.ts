import { OrderType } from '../order-type.enum';
import { PaymentType } from '../payment-type.enum';

export interface Order {
  orderType: OrderType;
  trainingId: number;
  price: number;
  trainingCount: number;
  sum: number;
  paymentType: PaymentType;
  createdAt?: Date;
}
