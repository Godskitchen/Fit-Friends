import * as crypto from 'node:crypto';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import {
  TrainerProfileEntity,
  UserEntity,
  UserProfileEntity,
  UserRepository,
} from '@libs/database-service';
import { LoginUserDto, NewUserDto } from '@app/user';
import {
  RefreshTokenData,
  RefreshTokenPayload,
  User,
} from '@libs/shared/app-types';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  getJwtAccessOptions,
  getJwtRefreshOptions,
} from '@libs/shared/helpers';
import { Response } from 'express';
import { REFRESH_TOKEN_NAME, SALT_ROUNDS } from './auth.constants';
import { UserService } from '../user/user.service';
import {
  ACCESS_DENIED,
  USER_ALREADY_EXISTS,
  WRONG_CREDENTIALS,
} from '@libs/shared/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(data: NewUserDto) {
    const existUser = await this.userRepository.findByEmail(data.email);

    if (existUser) {
      throw new ConflictException(USER_ALREADY_EXISTS);
    }

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
      throw new UnauthorizedException(WRONG_CREDENTIALS);
    }

    return existUser;
  }

  public async createNewTokens(
    { userId, name, email, role }: User,
    response: Response,
  ) {
    if (await this.refreshTokenService.isExists(userId)) {
      await this.refreshTokenService.deleteRefreshSession(userId);
    }

    const tokenId = crypto.randomUUID();
    const tokenData = await this.refreshTokenService.createRefreshSession({
      sub: userId,
      tokenId,
    });

    const accessToken = await this.jwtService.signAsync(
      { sub: userId, name, email, role },
      await getJwtAccessOptions(this.configService),
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, tokenId },
      await getJwtRefreshOptions(this.configService),
    );

    this.setRefreshTokenToCookies(refreshToken, tokenData, response);

    return { accessToken };
  }

  private setRefreshTokenToCookies(
    token: string,
    data: RefreshTokenData,
    response: Response,
  ) {
    response.cookie(REFRESH_TOKEN_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      expires: data.expiresIn,
      path: '/',
    });
  }

  public async getTokenData(
    refreshToken: string,
  ): Promise<RefreshTokenPayload | null> {
    return this.jwtService
      .verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.getOrThrow('jwt.refreshTokenSecret'),
      })
      .catch(() => null);
  }

  public async refreshTokens(refreshToken: string | null, response: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException(ACCESS_DENIED);
    }

    const tokenPayload = await this.getTokenData(refreshToken);
    if (!tokenPayload) {
      throw new UnauthorizedException(ACCESS_DENIED);
    }

    const existToken = await this.refreshTokenService.getRefreshSession(
      tokenPayload.sub,
    );
    if (!existToken) {
      throw new UnauthorizedException(ACCESS_DENIED);
    }

    await this.refreshTokenService.deleteRefreshSession(existToken.userId);
    if (existToken.expiresIn < new Date()) {
      throw new UnauthorizedException(ACCESS_DENIED);
    }

    const user = await this.userService.getDetails(existToken.userId);
    return this.createNewTokens(user, response);
  }

  public async isVerifiedAccessToken(accessToken: string): Promise<boolean> {
    return this.jwtService
      .verifyAsync(accessToken, {
        secret: this.configService.getOrThrow<string>('jwt.accessTokenSecret'),
      })
      .then(() => true)
      .catch(() => false);
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
