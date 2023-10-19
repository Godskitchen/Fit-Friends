import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { fillRDO } from '@libs/shared/helpers';
import { UserRdo } from './rdo/user.rdo';
import { JwtAccessGuard, ModifyProfileGuard } from '@libs/shared/guards';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId')
  public async getUserDetails(@Param('userId') id: number) {
    const user = await this.userService.getDetails(id);
    return fillRDO(UserRdo, user, [user.role]);
  }

  @UseGuards(JwtAccessGuard, ModifyProfileGuard)
  @Patch('/:userId')
  public async updateUserData(
    @Param('userId', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateData(id, dto);
    return fillRDO(UserRdo, updatedUser, [updatedUser.role]);
  }
}
