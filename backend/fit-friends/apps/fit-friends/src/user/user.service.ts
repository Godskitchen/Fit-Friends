import {
  TrainerProfileEntity,
  UserEntity,
  UserProfileEntity,
  UserRepository,
} from '@libs/database-service';
import { USER_ALREADY_EXISTS, USER_NOT_FOUND } from '@libs/shared/common';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewUserDto } from './dto/new-user.dto';
import { genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from '@app/auth/auth.constants';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: NewUserDto) {
    const existUser = await this.userRepository.findByEmail(dto.email);

    if (existUser) {
      throw new ConflictException(USER_ALREADY_EXISTS);
    }

    const { password, userProfile, trainerProfile, ...userData } = dto;
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
  async getDetails(userId: number) {
    const existUser = await this.userRepository.findById(userId);
    if (!existUser) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return existUser;
  }

  async getByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  private async setPassword(password: string): Promise<string> {
    const salt = await genSalt(SALT_ROUNDS);
    return hash(password, salt);
  }
}
