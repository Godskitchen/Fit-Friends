import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/database.service';
import { ReplyEntity } from '../entities/reply.entity';
import { BaseQuery, Reply } from '@libs/shared/app-types';

@Injectable()
export class ReplyRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(entity: ReplyEntity): Promise<Reply> {
    const { trainingId, authorId, rating, text } = entity.toObject();

    const reply = await this.prismaConnector.reply.create({
      data: {
        rating,
        text,
        author: { connect: { userId: authorId } },
        training: { connect: { trainingId } },
      },
      include: {
        author: { include: { userProfile: true } },
      },
    });

    const averageRating = await this.prismaConnector.reply
      .aggregate({
        where: { trainingId },
        _avg: { rating: true },
      })
      .then((agg) => agg._avg.rating);

    if (averageRating) {
      await this.prismaConnector.training.update({
        where: { trainingId },
        data: { rating: averageRating },
      });
    }

    return reply;
  }

  public async findById(replyId: number): Promise<Reply | null> {
    return this.prismaConnector.reply.findUnique({
      where: { replyId },
    });
  }

  public async findAllByTrainingId(
    trainingId: number,
    { limit, page, sortDirection }: BaseQuery,
  ): Promise<Reply[]> {
    return this.prismaConnector.reply.findMany({
      where: { trainingId },
      include: {
        author: { include: { userProfile: true } },
      },
      take: limit,
      skip: page ? limit * (page - 1) : undefined,
      orderBy: { createdAt: sortDirection },
    });
  }

  public async findExist(
    authorId: number,
    trainingId: number,
  ): Promise<Reply | null> {
    return this.prismaConnector.reply.findFirst({
      where: {
        authorId,
        trainingId,
      },
    });
  }
}
