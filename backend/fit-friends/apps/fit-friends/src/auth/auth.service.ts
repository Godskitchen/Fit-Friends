import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import NewUserDto from './dto/new-user.dto';
import {
  TrainerProfileEntity,
  UserEntity,
  UserProfileEntity,
  UserRepository,
} from '@libs/database-service';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(data: NewUserDto) {
    const { password, userProfile, trainerProfile } = data;
    const hashPassword = await this.setPassword(password);

    const userEntity = new UserEntity({
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl,
      hashPassword,
      gender: data.gender,
      role: data.role,
      aboutInfo: data.aboutInfo,
      birthDate: data.birthDate,
      location: data.location,
      backgroundImage: data.backgroundImage,
      userProfile: userProfile ? new UserProfileEntity(userProfile) : undefined,
      trainerProfile: trainerProfile
        ? new TrainerProfileEntity(trainerProfile)
        : undefined,
    });

    const user = await this.userRepository.create(userEntity);
    console.log(user);
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
