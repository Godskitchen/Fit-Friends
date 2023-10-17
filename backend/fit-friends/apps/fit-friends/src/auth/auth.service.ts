import * as crypto from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserRepository } from '@libs/database-service';
import { LoginUserDto, NewUserDto } from '@app/user';
import { RefreshTokenData, User } from '@libs/shared/app-types';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  getJwtAccessOptions,
  getJwtRefreshOptions,
} from '@libs/shared/helpers';
import { Response } from 'express';
import { REFRESH_TOKEN_NAME } from './auth.constants';
import { WRONG_CREDENTIALS } from '@libs/shared/common';
import { RefreshTokenService } from '@app/refresh-token/refresh-token.service';
import { UserService } from '@app/user/user.service';

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
    return this.userService.create(data);
  }

  public async authorize(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.userService.getByEmail(email);

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

  public async refreshTokens(userId: number, response: Response) {
    const user = await this.userService.getDetails(userId);
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

  private async comparePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return compare(password, userPassword);
  }
}
