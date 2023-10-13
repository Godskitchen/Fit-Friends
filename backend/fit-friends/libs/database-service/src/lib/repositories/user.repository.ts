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

  public async create(entity: UserEntity) {
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

  public async findByEmail(email: string): Promise<User | null> {
    return this.prismaConnector.user.findUnique({
      where: { email },
      include: {
        userProfile: true,
        trainerProfile: true,
      },
    });
  }
}
