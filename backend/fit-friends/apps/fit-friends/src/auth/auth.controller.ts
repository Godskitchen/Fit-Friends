import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDto, UserRdo } from '@app/user';
import { fillRDO } from '@libs/shared/helpers';
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
}
