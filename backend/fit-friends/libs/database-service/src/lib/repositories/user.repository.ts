import { DatabaseService, UserEntity } from '@libs/database-service';
import { User } from '@libs/shared/app-types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(item: UserEntity): Promise<User> {
    const data = item.toObject();
    return this.prismaConnector.user.create({ data });
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
