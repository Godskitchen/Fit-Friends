import { OrderEntity } from '../entities/order.entity';
import {
  DEFAULT_SORT_DIRECTION,
  Order,
  OrderQuery,
  SortDirection,
  SortType,
} from '@libs/shared/app-types';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/database.service';

@Injectable()
export class OrderRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(item: OrderEntity): Promise<Order> {
    const { trainingId, customerId, ...restData } = item.toObject();

    return this.prismaConnector.order.create({
      data: {
        ...restData,
        customer: { connect: { userId: customerId } },
        training: { connect: { trainingId } },
      },
      include: {
        training: true,
      },
    });
  }

  public async findByTrainerId(
    trainerId: number,
    { limit, page, sort, sortDirection }: OrderQuery,
  ) {
    return this.prismaConnector.order.findMany({
      where: { training: { trainerId } },
      orderBy: sort
        ? {
            [SortType[sort]]: sortDirection
              ? SortDirection[sortDirection]
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
