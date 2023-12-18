import { PaymentTypeToServer } from '../adaprters-constants';

export type NewOrderDto = {
  trainingId: number;
  trainingCount: number;
  paymentType: (typeof PaymentTypeToServer)[keyof typeof PaymentTypeToServer];
}
