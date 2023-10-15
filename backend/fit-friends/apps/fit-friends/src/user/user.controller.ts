import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { fillRDO } from '@libs/shared/helpers';
import { UserRdo } from './rdo/user.rdo';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  public async getUserDetails(@Param('userId') id: string) {
    const user = await this.userService.getDetails(parseInt(id));
    return fillRDO(UserRdo, user, [user.role]);
  }
}
