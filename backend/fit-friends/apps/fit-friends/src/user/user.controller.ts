import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  getUserDetails(@Param('userId') id: string) {
    return this.userService.getDetails(parseInt(id));
  }
}
