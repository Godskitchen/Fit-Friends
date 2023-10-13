import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import NewUserDto from './dto/new-user.dto';
import { UserEntity } from '@libs/database-service';

const SALT_ROUNDS = 10;

@Injectable()
export default class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(data: NewUserDto) {
    const { password } = data;
    const hashPassword = await this.setPassword(password);

    const userData: ReturnType<UserEntity['toObject']> = {
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
      userProfile: data.userProfile,
      trainerProfile: data.trainerProfile,
    };

    return this.userService.create(userData);
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
