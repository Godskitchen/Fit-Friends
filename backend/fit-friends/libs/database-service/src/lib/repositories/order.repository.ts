import { DatabaseService } from '@libs/database-service';
import { OrderEntity } from '../entities/order.entity';
import { Order } from '@libs/shared/app-types';
import {
  DEFAULT_SORT_DIRECTION,
  OrderQuery,
  SortDirection,
  SortType,
} from '@app/order';

export class OrderRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }
  public async create(item: OrderEntity): Promise<Order> {
    const { trainingId, ...restData } = item.toObject();

    return this.prismaConnector.order.create({
      data: {
        ...restData,
        training: { connect: { trainingId } },
      },
      include: {
        training: true,
      },
    });
  }

  public async findByTrainerId(
    trainerId: number,
    { limit, page, sort, direction }: OrderQuery,
  ) {
    return this.prismaConnector.order.findMany({
      where: { training: { trainerId } },
      orderBy: sort
        ? {
            [SortType[sort]]: direction
              ? SortDirection[direction]
              : DEFAULT_SORT_DIRECTION,
          }
        : { createdAt: DEFAULT_SORT_DIRECTION },
      take: limit,
      skip: page ? limit * (page - 1) : undefined,
      include: {
        training: true,
      },
    });
  }
}
