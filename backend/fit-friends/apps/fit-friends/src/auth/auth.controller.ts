import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto, AuthUserRdo, LoginUserDto } from '@app/user';
import { fillRDO } from '@libs/shared/helpers';
import {
  RequestWithAccessTokenPayload,
  RequestWithRefreshTokenPayload,
  RequestWithUserInfo,
} from '@libs/shared/app-types';
import { Response } from 'express';
import { Token } from '@libs/shared/common';
import {
  JwtAccessGuard,
  JwtRefreshGuard,
  LocalAuthGuard,
  PublicGuard,
} from '@libs/shared/guards';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { REFRESH_TOKEN_NAME } from './auth.constants';
import { AccessTokenRdo } from './rdo/access-token.rdo';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiHeader({
    name: 'Authorization',
    required: false,
    description: 'Заголовок авторизации не должен присутствовать',
  })
  @ApiCreatedResponse({
    description:
      'Новый пользователь успешно создан. Получен новый JWT access token. Новый JWT Refresh token устанавливается в cookies',
    type: AuthUserRdo,
    headers: {
      'Set-Cookie': {
        example: `${REFRESH_TOKEN_NAME}=somerefreshtokenvalue`,
        description: 'Установка refresh token в cookie',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Маршрут доступен только для анонимных пользователей.',
  })
  @ApiConflictResponse({
    description: 'Пользователь с таким email уже существует',
  })
  @ApiBadRequestResponse({
    description:
      'Не пройдена валидация полей DTO, какой-либо из загружаемых файлов не найден.',
  })
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
    @Res({ passthrough: true }) response: Response,
  ) {
    const newUser = await this.authService.register(dto);

    const newAccessToken = await this.authService.createNewTokens(
      newUser,
      response,
    );

    return fillRDO(AuthUserRdo, Object.assign(newUser, newAccessToken));
  }

  @ApiOkResponse({
    description:
      'Пользователь успешно авторизован. Получен новый JWT access token или актуальный token, если он был передан в заголовке авторизации. Новый JWT Refresh token устанавливается в cookies',
    type: AuthUserRdo,
    headers: {
      'Set-Cookie': {
        example: `${REFRESH_TOKEN_NAME}=somerefreshtokenvalue`,
        description: 'Установка refresh token в cookie',
      },
    },
  })
  @ApiHeader({
    name: 'Authorization',
    required: false,
    description: 'Необязательная передача актуального access token',
  })
  @ApiUnauthorizedResponse({ description: 'Неверный email или пароль' })
  @ApiBadRequestResponse({
    description: 'Не пройдена валидация полей DTO',
  })
  @ApiBody({ type: LoginUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
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

  @ApiCookieAuth()
  @ApiUnauthorizedResponse({
    description:
      'В cookie передан невалидный refresh token или не передан вовсе.',
  })
  @ApiOkResponse({
    description:
      'Получен новый JWT access token. Новый JWT Refresh token устанавливается в cookies',
    type: AccessTokenRdo,
    headers: {
      'Set-Cookie': {
        example: `${REFRESH_TOKEN_NAME}=somerefreshtokenvalue`,
        description: 'Установка refresh token в cookie',
      },
    },
  })
  @Get('/refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  public async refreshTokens(
    @Req() { user }: RequestWithRefreshTokenPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(user);
    const userWithToken = await this.authService.refreshTokens(
      user.sub,
      response,
    );

    return fillRDO(AuthUserRdo, userWithToken, [userWithToken.role]);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description:
      'Пользователь успешно авторизован, его access token актуален. Он же возвращается клиенту',
    type: AccessTokenRdo,
  })
  @ApiUnauthorizedResponse({
    description: 'Передан невалидный access token или не передан вовсе.',
  })
  @Get('/')
  @UseGuards(JwtAccessGuard)
  public async checkAuth(
    @Token() accessToken: string,
    @Req() { user }: RequestWithAccessTokenPayload,
  ) {
    const existUser = await this.authService.getProfile(user.sub);
    return fillRDO(AuthUserRdo, Object.assign(existUser, accessToken), [
      user.role,
    ]);
  }
}
