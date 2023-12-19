import { TrainingCardType } from './training.type';

export type OrderCardType = {
  training: TrainingCardType;
  sum: number;
  trainingCount: number;
}

export type OrderList = {
  orderList: OrderCardType[];
  totalOrdersCount: number;
}

