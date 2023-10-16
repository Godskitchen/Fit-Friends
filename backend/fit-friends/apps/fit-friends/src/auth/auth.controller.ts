import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto, UserRdo } from '@app/user';
import { fillRDO } from '@libs/shared/helpers';
import { LocalAuthGuard } from '@libs/database-service';
import { RequestWithUserInfo } from '@libs/shared/app-types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
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
  public async loginUser(@Req() { user }: RequestWithUserInfo) {
    const tokens = await this.authService.createUserToken(user);
    return tokens;
  }
}
