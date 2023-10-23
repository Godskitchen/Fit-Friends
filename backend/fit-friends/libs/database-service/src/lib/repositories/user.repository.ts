import { Role, UpdateUserData, User } from '@libs/shared/app-types';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/database.service';
import { UserEntity } from '../entities/user.entity';
import { UserQuery } from '@app/user';

const SortType = {
  [Role.User]: 'asc',
  [Role.Trainer]: 'desc',
} as const;

const DEFAULT_SORT_DIRECTION = 'desc';

@Injectable()
export class UserRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(entity: UserEntity): Promise<User> {
    const data = entity.toObject();

    return this.prismaConnector.user.create({
      data: {
        ...data,
        userProfile: data.userProfile
          ? { create: { ...data.userProfile } }
          : undefined,
        trainerProfile: data.trainerProfile
          ? { create: { ...data.trainerProfile } }
          : undefined,
      },
      include: {
        userProfile: Boolean(data.userProfile),
        trainerProfile: Boolean(data.trainerProfile),
      },
    });
  }

  public async update(userId: number, data: UpdateUserData): Promise<User> {
    const { userProfile, trainerProfile, ...restInfo } = data;
    return this.prismaConnector.user.update({
      where: {
        userId,
      },
      data: {
        ...restInfo,
        userProfile: {
          update: {
            data: userProfile,
          },
        },
        trainerProfile: {
          update: {
            data: trainerProfile,
          },
        },
        trainings: {
          connect: [],
        },
      },
      include: {
        userProfile: true,
        trainerProfile: true,
      },
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.prismaConnector.user.findUnique({
      where: { email },
      include: {
        userProfile: true,
        trainerProfile: true,
      },
    });
  }

  public async findById(id: number): Promise<User | null> {
    return this.prismaConnector.user.findUnique({
      where: { userId: id },
      include: {
        userProfile: true,
        trainerProfile: true,
      },
    });
  }

  public async find({
    limit,
    page,
    location,
    fitnessLevel,
    trainingType,
    sort,
  }: UserQuery): Promise<User[]> {
    const locationFilter = location
      ? location.map((value) => ({ location: value }))
      : [];

    const fitnessLevelFilter = fitnessLevel
      ? fitnessLevel.map((value) => ({ fitnessLevel: value }))
      : [];

    const trainingTypeFilter = trainingType
      ? { hasSome: trainingType }
      : undefined;

    return this.prismaConnector.user.findMany({
      where: {
        AND: [
          { OR: locationFilter },
          {
            OR: [
              {
                userProfile: {
                  AND: [
                    { OR: fitnessLevelFilter },
                    { trainingType: trainingTypeFilter },
                  ],
                },
              },
              {
                trainerProfile: {
                  AND: [
                    { OR: fitnessLevelFilter },
                    { trainingType: trainingTypeFilter },
                  ],
                },
              },
            ],
          },
        ],
      },
      orderBy: sort
        ? { role: SortType[sort] }
        : { createdAt: DEFAULT_SORT_DIRECTION },
      take: limit,
      skip: page ? limit * (page - 1) : undefined,
      include: {
        trainerProfile: true,
        userProfile: true,
      },
    });
  }
}
