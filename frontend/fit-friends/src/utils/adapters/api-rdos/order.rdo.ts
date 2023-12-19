import { TrainingRdo } from './training.rdo';

export type OrderTrainingRdo = {
  training: TrainingRdo;
  sum: number;
  trainingCount: number;
}


export type OrderListRdo = {
  orderList: OrderTrainingRdo[];
  totalOrdersCount: number;
}
