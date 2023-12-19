import { OrderEntity } from '../entities/order.entity';
import {
  DEFAULT_SORT_DIRECTION,
  Order,
  OrderQuery,
  OrderSortType,
  Training,
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

  public async findAndGroupByTrainerId(
    trainerId: number,
    { limit, page, sort, sortDirection }: OrderQuery,
  ) {
    const totalOrdersCount = await this.prismaConnector.order
      .groupBy({
        where: { training: { trainerId } },
        by: ['trainingId'],
        _sum: {
          sum: true,
          trainingCount: true,
        },
      })
      .then((allGroups) => allGroups.length);

    const groups = await this.prismaConnector.order.groupBy({
      where: { training: { trainerId } },
      by: ['trainingId'],
      _sum: {
        sum: true,
        trainingCount: true,
      },
      orderBy:
        sort && sortDirection
          ? { _sum: { [OrderSortType[sort]]: sortDirection } }
          : { _sum: { trainingCount: DEFAULT_SORT_DIRECTION } },
      take: limit,
      skip: page ? limit * (page - 1) : undefined,
    });

    const orderList = await Promise.all(
      groups.map(async (entry) => {
        const training = await this.prismaConnector.order
          .findFirst({
            where: { trainingId: entry.trainingId },
            select: { training: true },
          })
          .then((result) => result?.training as Omit<Training, 'trainer'>);

        return {
          training,
          sum: entry._sum.sum as number,
          trainingCount: entry._sum.trainingCount as number,
        };
      }),
    );

    return { orderList, totalOrdersCount };
  }
}
