import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { fillRDO } from '@libs/shared/helpers';
import { UserRdo } from './rdo/user.rdo';
import { JwtAccessGuard, ModifyProfileGuard } from '@libs/shared/guards';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQuery } from './queries/user.query';
import { Role } from '@libs/shared/app-types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId')
  public async getUserDetails(@Param('userId', ParseIntPipe) id: number) {
    const user = await this.userService.getDetails(id);
    return fillRDO(UserRdo, user, [user.role]);
  }

  @UseGuards(JwtAccessGuard, ModifyProfileGuard)
  @Patch('/:userId')
  public async updateUserData(
    @Param('userId', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateData(id, dto);
    return fillRDO(UserRdo, updatedUser, [updatedUser.role]);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/')
  public async getUsers(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    userQuery: UserQuery,
  ) {
    const users = await this.userService.getMany(userQuery);
    return fillRDO(UserRdo, users, [Role.Trainer, Role.User]);
  }
}
