import { Order, OrderType, PaymentType } from '@libs/shared/app-types';

export class OrderEntity implements Omit<Order, 'orderId'> {
  orderType: OrderType;
  trainingId: number;
  price: number;
  trainingCount: number;
  sum: number;
  paymentType: PaymentType;

  constructor(order: Omit<Order, 'orderId'>) {
    this.orderType = order.orderType;
    this.trainingId = order.trainingId;
    this.price = order.price;
    this.trainingCount = order.trainingCount;
    this.sum = order.sum;
    this.paymentType = order.paymentType;
  }

  toObject() {
    return {
      orderType: this.orderType,
      trainingId: this.trainingId,
      price: this.price,
      trainingCount: this.trainingCount,
      sum: this.sum,
      paymentType: this.paymentType,
    };
  }
}
