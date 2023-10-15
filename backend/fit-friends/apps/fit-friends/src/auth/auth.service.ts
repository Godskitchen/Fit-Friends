import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import {
  TrainerProfileEntity,
  UserEntity,
  UserProfileEntity,
  UserRepository,
} from '@libs/database-service';
import { NewUserDto } from '@app/user';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(data: NewUserDto) {
    const { password, userProfile, trainerProfile, ...userData } = data;
    const hashPassword = await this.setPassword(password);

    const userEntity = new UserEntity({
      ...userData,
      hashPassword,
      userProfile: userProfile ? new UserProfileEntity(userProfile) : undefined,
      trainerProfile: trainerProfile
        ? new TrainerProfileEntity(trainerProfile)
        : undefined,
    });

    return this.userRepository.create(userEntity);
  }

  private async setPassword(password: string): Promise<string> {
    const salt = await genSalt(SALT_ROUNDS);
    return hash(password, salt);
  }

  private async comparePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return compare(password, userPassword);
  }
}
