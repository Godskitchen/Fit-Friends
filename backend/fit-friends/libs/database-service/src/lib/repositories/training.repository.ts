import { Injectable } from '@nestjs/common';
import { TrainingEntity } from '../entities/training.entity';
import { DatabaseService } from '../prisma/database.service';
import { Training } from '@libs/shared/app-types';

@Injectable()
export class TrainingRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(entity: TrainingEntity): Promise<Training> {
    const { trainer, ...restData } = entity.toObject();

    return this.prismaConnector.training.create({
      data: {
        ...restData,
        trainer: {
          connect: { userId: trainer.userId },
        },
      },
      include: {
        trainer: {
          include: {
            userProfile: true,
            trainerProfile: true,
          },
        },
      },
    });
  }

  // public async update(userId: number, data: UpdateUserData): Promise<User> {
  //   const { userProfile, trainerProfile, ...restInfo } = data;
  //   return this.prismaConnector.user.update({
  //     where: {
  //       userId,
  //     },
  //     data: {
  //       ...restInfo,
  //       userProfile: {
  //         update: {
  //           data: userProfile,
  //         },
  //       },
  //       trainerProfile: {
  //         update: {
  //           data: trainerProfile,
  //         },
  //       },
  //     },
  //     include: {
  //       userProfile: true,
  //       trainerProfile: true,
  //     },
  //   });
  // }

  public async findById(trainingId: number): Promise<Training | null> {
    return this.prismaConnector.training.findUnique({
      where: { trainingId },
      include: {
        trainer: {
          include: {
            userProfile: true,
            trainerProfile: true,
          },
        },
      },
    });
  }

  // public async find({
  //   limit,
  //   page,
  //   location,
  //   fitnessLevel,
  //   trainingType,
  //   sort,
  // }: UserQuery): Promise<User[]> {
  //   const locationFilter = location
  //     ? location.map((value) => ({ location: value }))
  //     : [];

  //   const fitnessLevelFilter = fitnessLevel
  //     ? fitnessLevel.map((value) => ({ fitnessLevel: value }))
  //     : [];

  //   const trainingTypeFilter = trainingType
  //     ? { hasSome: trainingType }
  //     : undefined;

  //   return this.prismaConnector.user.findMany({
  //     where: {
  //       AND: [
  //         { OR: locationFilter },
  //         {
  //           OR: [
  //             {
  //               userProfile: {
  //                 AND: [
  //                   { OR: fitnessLevelFilter },
  //                   { trainingType: trainingTypeFilter },
  //                 ],
  //               },
  //             },
  //             {
  //               trainerProfile: {
  //                 AND: [
  //                   { OR: fitnessLevelFilter },
  //                   { trainingType: trainingTypeFilter },
  //                 ],
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     orderBy: sort
  //       ? { role: SortType[sort] }
  //       : { createdAt: DEFAULT_SORT_DIRECTION },
  //     take: limit,
  //     skip: page ? limit * (page - 1) : undefined,
  //     include: {
  //       trainerProfile: true,
  //       userProfile: true,
  //     },
  //   });
  // }
}
