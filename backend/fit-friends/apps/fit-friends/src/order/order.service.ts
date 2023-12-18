import {
  BalanceRepository,
  OrderEntity,
  OrderRepository,
  TrainingRepository,
  UserBalanceEntity,
} from '@libs/database-service';
import { NewOrderDto } from './dto/new-order.dto';
import { TrainingErrors } from '@libs/shared/common';
import { BadRequestException, Inject } from '@nestjs/common';
import { OrderQuery } from './queries/order.query';

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(TrainingRepository)
    private readonly trainingRepository: TrainingRepository,
    private readonly balanceRepository: BalanceRepository,
  ) {}

  public async create(
    { trainingId, trainingCount, orderType, paymentType }: NewOrderDto,
    userId: number,
  ) {
    const training = await this.trainingRepository.findById(trainingId);

    if (!training) {
      throw new BadRequestException(TrainingErrors.TRAINING_NOT_FOUND);
    }

    const price = training.isSpecialOffer
      ? Number((training.price - training.price * 0.1).toFixed())
      : training.price;
    const sum = price * trainingCount;

    const order = await this.orderRepository.create(
      new OrderEntity({
        orderType,
        trainingId,
        price,
        trainingCount,
        sum,
        paymentType,
        customerId: userId,
      }),
    );

    await this.balanceRepository.createOrUpdate(
      new UserBalanceEntity({
        userId,
        trainingId,
        remainingAmount: trainingCount,
      }),
    );
    return order;
  }

  public async getByUserId(trainerId: number, query: OrderQuery) {
    return this.orderRepository.findByTrainerId(trainerId, query);
  }
}
