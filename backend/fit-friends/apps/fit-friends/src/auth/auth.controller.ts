import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto, UserRdo } from '@app/user';
import { fillRDO } from '@libs/shared/helpers';
import {
  JwtRefreshGuard,
  LocalAuthGuard,
  PublicGuard,
} from '@libs/database-service';
import {
  RequestWithTokenPayload,
  RequestWithUserInfo,
} from '@libs/shared/app-types';
import { Response } from 'express';
import { Token } from '@libs/shared/common';
import { AuthUserRdo } from '../user/rdo/auth-user.rdo';

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
    @Req() { user }: RequestWithTokenPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.authService.refreshTokens(
      user.sub,
      response,
    );

    return accessToken;
  }
}
