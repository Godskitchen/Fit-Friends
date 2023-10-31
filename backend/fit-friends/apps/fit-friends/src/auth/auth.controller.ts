import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto, UserRdo, AuthUserRdo } from '@app/user';
import { fillRDO } from '@libs/shared/helpers';
import {
  RequestWithRefreshTokenPayload,
  RequestWithUserInfo,
} from '@libs/shared/app-types';
import { Response } from 'express';
import { AuthErrors, Token } from '@libs/shared/common';
import {
  JwtAccessGuard,
  JwtRefreshGuard,
  LocalAuthGuard,
  PublicGuard,
} from '@libs/shared/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UseGuards(PublicGuard)
  public async register(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    dto: NewUserDto,
  ) {
    const newUser = await this.authService.register(dto);

    return fillRDO(UserRdo, newUser, [newUser.role]);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  public async login(
    @Token() accessToken: string | null,
    @Req() { user }: RequestWithUserInfo,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (
      accessToken &&
      (await this.authService.isVerifiedAccessToken(accessToken))
    ) {
      return fillRDO(AuthUserRdo, Object.assign(user, { accessToken }), [
        user.role,
      ]);
    }

    const newAccessToken = await this.authService.createNewTokens(
      user,
      response,
    );

    return fillRDO(AuthUserRdo, Object.assign(user, newAccessToken), [
      user.role,
    ]);
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  public async refreshTokens(
    @Req() { user }: RequestWithRefreshTokenPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.authService.refreshTokens(
      user.sub,
      response,
    );

    return accessToken;
  }

  @Get('/')
  @UseGuards(JwtAccessGuard)
  public async checkAuth(@Token() accessToken: string | null) {
    if (!accessToken) {
      throw new UnauthorizedException(AuthErrors.ACCESS_DENIED);
    }

    return { accessToken };
  }
}
