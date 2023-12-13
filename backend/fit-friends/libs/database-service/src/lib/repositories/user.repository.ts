import {
  BaseQuery,
  CreateProfileData,
  Role,
  UpdateUserData,
  User,
  UserQuery,
} from '@libs/shared/app-types';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/database.service';
import { UserEntity } from '../entities/user.entity';

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
    const {
      name,
      email,
      avatarUrl,
      hashPassword,
      gender,
      role,
      aboutInfo,
      birthDate,
      location,
      backgroundImage,
    } = entity.toObject();

    return this.prismaConnector.user.create({
      data: {
        name,
        email,
        avatarUrl,
        hashPassword,
        gender,
        role,
        aboutInfo,
        birthDate,
        location,
        backgroundImage,
      },
    });
  }

  public async createProfile(
    userId: number,
    profile: CreateProfileData,
  ): Promise<User> {
    const { userProfile, trainerProfile } = profile;
    return this.prismaConnector.user.update({
      where: { userId },
      data: {
        userProfile: userProfile ? { create: { ...userProfile } } : undefined,
        trainerProfile: trainerProfile
          ? { create: { ...trainerProfile } }
          : undefined,
      },
      include: {
        userProfile: true,
        trainerProfile: true,
      },
    });
  }

  public async update(userId: number, data: UpdateUserData): Promise<User> {
    const { userProfile, trainerProfile, ...restInfo } = data;
    return this.prismaConnector.user.update({
      where: { userId },
      data: {
        ...restInfo,
        userProfile: { update: { data: userProfile } },
        trainerProfile: { update: { data: trainerProfile } },
        trainings: { connect: [] },
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

  public async find(
    { limit, page, location, fitnessLevel, trainingType, sort }: UserQuery,
    userId: number,
  ) {
    const locationFilter = location
      ? location.map((value) => ({ location: value }))
      : [];

    const fitnessLevelFilter = fitnessLevel
      ? fitnessLevel.map((value) => ({ fitnessLevel: value }))
      : [];

    const trainingTypeFilter = trainingType
      ? { hasSome: trainingType }
      : undefined;

    const totalUsersCount = await this.prismaConnector.user.count({
      where: {
        AND: [
          { userId: { not: userId } },
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
    });

    const userList = await this.prismaConnector.user.findMany({
      where: {
        AND: [
          { userId: { not: userId } },
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

    return { totalUsersCount, userList };
  }

  public async addFriend(userId: number, friendId: number) {
    await Promise.all([
      this.prismaConnector.user.update({
        where: { userId },
        data: { friends: { connect: { userId: friendId } } },
      }),
      this.prismaConnector.user.update({
        where: { userId: friendId },
        data: { friends: { connect: { userId } } },
      }),
    ]);
  }

  public async removeFriend(userId: number, friendId: number) {
    await Promise.all([
      this.prismaConnector.user.update({
        where: { userId },
        data: { friends: { disconnect: { userId: friendId } } },
      }),
      this.prismaConnector.user.update({
        where: { userId: friendId },
        data: { friends: { disconnect: { userId } } },
      }),
    ]);
  }

  public async getFriends(
    userId: number,
    { limit, page, sortDirection }: BaseQuery,
  ) {
    const totalFriendsCount = await this.prismaConnector.user
      .findUnique({
        where: { userId },
        select: { friends: true },
      })
      .then((user) => (user ? user.friends.length : 0));

    const friendList = await this.prismaConnector.user
      .findUnique({
        where: { userId },
        select: {
          friends: {
            take: limit,
            skip: page ? limit * (page - 1) : undefined,
            include: {
              userProfile: true,
              trainerProfile: true,
              trainingRequestsAsSender: {
                where: { recepientId: userId },
              },
              trainingRequestsAsRecepient: {
                where: { senderId: userId },
              },
            },
            orderBy: { createdAt: sortDirection },
          },
        },
      })
      .then((user) => (user ? user.friends : []));

    return { friendList, totalFriendsCount };
  }

  public async findFriend(userId: number, friendId: number) {
    return this.prismaConnector.user
      .findUnique({
        where: { userId },
        select: {
          friends: {
            where: { userId: friendId },
          },
        },
      })
      .then((user) => (user ? user.friends : []));
  }
}
