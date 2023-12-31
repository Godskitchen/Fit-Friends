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

    return this.prismaConnector.reply.create({
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
  }

  public async getAverageRating(trainingId: number) {
    return this.prismaConnector.reply
      .aggregate({
        where: { trainingId },
        _avg: { rating: true },
      })
      .then((aggResult) => aggResult._avg.rating);
  }

  public async findById(replyId: number): Promise<Reply | null> {
    return this.prismaConnector.reply.findUnique({
      where: { replyId },
    });
  }

  public async findAllByTrainingId(
    trainingId: number,
    { limit, page, sortDirection }: BaseQuery,
  ) {
    const totalRepliesCount = await this.prismaConnector.reply.count({
      where: { trainingId },
    });

    const replyList = await this.prismaConnector.reply.findMany({
      where: { trainingId },
      include: {
        author: { include: { userProfile: true } },
      },
      take: limit,
      skip: page ? limit * (page - 1) : undefined,
      orderBy: { createdAt: sortDirection },
    });

    return { replyList, totalRepliesCount };
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
