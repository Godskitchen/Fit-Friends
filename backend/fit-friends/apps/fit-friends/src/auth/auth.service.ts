import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import {
  TrainerProfileEntity,
  UserEntity,
  UserProfileEntity,
  UserRepository,
} from '@libs/database-service';
import { LoginUserDto, NewUserDto } from '@app/user';
import { User } from '@libs/shared/app-types';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { ConfigService } from '@nestjs/config';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

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

  public async authorize(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.userRepository.findByEmail(email);

    if (
      !existUser ||
      !(await this.comparePassword(password, existUser.hashPassword))
    ) {
      throw new UnauthorizedException('Неверный логин или пароль.');
    }

    return existUser;
  }

  public createUserTokens = async ({ userId, name, email, role }: User) => {
    const tokenId = crypto.randomUUID();
    await this.refreshTokenService.createRefreshSession({
      sub: userId,
      tokenId,
    });

    return {
      accessToken: await this.jwtService.signAsync(
        { sub: userId, name, email, role },
        await getJwtAccessOptions(this.configService),
      ),
      refreshToken: await this.jwtService.signAsync(
        { sub: userId, tokenId },
        await getJwtRefreshOptions(this.configService),
      ),
    };
  };

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
