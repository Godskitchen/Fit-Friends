import { RequestWithAccessTokenPayload, Role } from '@libs/shared/app-types';
import {
  CreateBalanceGuard,
  JwtAccessGuard,
  ModifyBalanceGuard,
  RoleGuard,
} from '@libs/shared/guards';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { BalanceService } from './balance.service';
import { Roles } from '@libs/shared/common';
import { fillRDO } from '@libs/shared/helpers';
import { BalanceRdo } from './rdo/balance.rdo';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { BalanceQuery } from './queries/balance.query';

@UseGuards(JwtAccessGuard, RoleGuard)
@Controller('/balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('/create')
  @UseGuards(CreateBalanceGuard)
  @Roles(Role.User)
  public async createBalance(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    dto: CreateBalanceDto,
  ) {
    const newBalance = await this.balanceService.create(user.sub, dto);
    return fillRDO(BalanceRdo, newBalance);
  }

  @Patch('/update')
  @UseGuards(ModifyBalanceGuard)
  @Roles(Role.User)
  public async updateBalance(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    dto: UpdateBalanceDto,
  ) {
    const balance = await this.balanceService.update(dto);
    return fillRDO(BalanceRdo, balance);
  }

  @Get('/my-balance')
  @Roles(Role.User)
  public async getUserBalance(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    query: BalanceQuery,
  ) {
    const totalBalance = await this.balanceService.getUserBalance(
      user.sub,
      query,
    );
    return fillRDO(BalanceRdo, totalBalance);
  }
}
