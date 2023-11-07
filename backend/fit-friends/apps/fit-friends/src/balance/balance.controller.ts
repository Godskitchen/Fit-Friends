import { RequestWithAccessTokenPayload, Role } from '@libs/shared/app-types';
import {
  JwtAccessGuard,
  ModifyBalanceGuard,
  RoleGuard,
} from '@libs/shared/guards';
import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Roles } from '@libs/shared/common';
import { fillRDO } from '@libs/shared/helpers';
import { BalanceRdo } from './rdo/balance.rdo';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { BalanceQuery } from './queries/balance.query';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAccessGuard, RoleGuard)
@ApiTags('balance')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Пользователь неавторизован',
})
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Patch('/update')
  @ApiOkResponse({
    description: 'Получена информация об измененном балансе пользователя',
    type: BalanceRdo,
  })
  @ApiBadRequestResponse({ description: 'Не пройдена валидация полей DTO' })
  @ApiForbiddenResponse({
    description:
      'Маршрут доступен только обычному пользователю. Запрещено изменять баланс другого пользователя',
  })
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

  @ApiOkResponse({
    description: 'Получен список балансов пользователя',
    type: [BalanceRdo],
  })
  @ApiBadRequestResponse({
    description: 'Не пройдена валидация полей query',
  })
  @ApiForbiddenResponse({
    description: 'Маршрут доступен только обычному пользователю',
  })
  @Get('/mylist')
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
