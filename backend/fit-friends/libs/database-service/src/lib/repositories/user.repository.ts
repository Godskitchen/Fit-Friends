import { User } from '@libs/shared/app-types';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../prisma/database.service';
import { UserEntity } from '../entities/user.entity';

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

  // public async update(
  //   updateData: Partial<UserEntity>,
  //   userId: number,
  // ): Promise<User> {
  //   return this.prismaConnector.user.update({
  //     where: {
  //       userId,
  //     },
  //     data: {

  //     }
  //   });
  // }

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
}
