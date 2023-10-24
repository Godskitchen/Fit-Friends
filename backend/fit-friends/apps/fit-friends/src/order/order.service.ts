import {
  OrderEntity,
  OrderRepository,
  TrainingRepository,
} from '@libs/database-service';
import { NewOrderDto } from './dto/new-order.dto';
import { TRAINING_NOT_FOUND } from '@libs/shared/common';
import { NotFoundException } from '@nestjs/common';
import { OrderQuery } from './queries/order.query';

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly trainingRepository: TrainingRepository,
  ) {}

  public async create({
    trainingId,
    trainingCount,
    orderType,
    paymentType,
  }: NewOrderDto) {
    const training = await this.trainingRepository.findById(trainingId);

    if (!training) {
      throw new NotFoundException(TRAINING_NOT_FOUND);
    }

    const price = training.price;
    const sum = price * trainingCount;

    return this.orderRepository.create(
      new OrderEntity({
        orderType,
        trainingId,
        price,
        trainingCount,
        sum,
        paymentType,
      }),
    );
  }

  public async getByUserId(trainerId: number, query: OrderQuery) {
    return this.orderRepository.findByTrainerId(trainerId, query);
  }
}