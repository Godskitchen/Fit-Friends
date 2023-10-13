import { Body, Controller, Post } from '@nestjs/common';
import NewUserDto from './dto/new-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  public async register(@Body() dto: NewUserDto) {
    await this.authService.register(dto);
  }
}
