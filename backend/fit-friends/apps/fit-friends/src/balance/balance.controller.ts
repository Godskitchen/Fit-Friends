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
  Param,
  ParseIntPipe,
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
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BalanceListRdo } from './rdo/balance-list.rdo';

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
  @ApiBadRequestResponse({
    description:
      'Не пройдена валидация полей DTO. Баланс пользователя с таким trainingId не найден',
  })
  @UseGuards(ModifyBalanceGuard)
  @Roles(Role.User)
  public async updateBalance(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    dto: UpdateBalanceDto,
  ) {
    const balance = await this.balanceService.update(user.sub, dto);
    return fillRDO(BalanceRdo, balance);
  }

  @ApiOkResponse({
    description:
      'Получен список балансов пользователя, а также их общее количество',
    type: BalanceListRdo,
  })
  @ApiBadRequestResponse({
    description: 'Не пройдена валидация полей query',
  })
  @ApiForbiddenResponse({
    description: 'Маршрут доступен только обычному пользователю',
  })
  @Get('/mylist')
  @Roles(Role.User)
  public async getUserTotalBalance(
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
    return fillRDO(BalanceListRdo, totalBalance);
  }

  @ApiOkResponse({
    description: `Возвращено количество оставшихся использований тренировок. 
      Если тренировка не приобреталась, то возвращается 0`,
    type: Boolean,
  })
  @ApiBadRequestResponse({
    description: 'Некорректный параметр trainingId.',
  })
  @ApiForbiddenResponse({
    description: 'Маршрут доступен только обычному пользователю',
  })
  @ApiParam({
    name: 'trainingId',
    description: 'id тренировки - целое положительное число',
  })
  @Get('/mylist/:trainingId')
  @Roles(Role.User)
  public async getTrainingBalanceRemainingAmount(
    @Req() { user }: RequestWithAccessTokenPayload,
    @Param('trainingId', ParseIntPipe) id: number,
  ) {
    const remainingAmount =
      await this.balanceService.getTrainingRemainingAmount(user.sub, id);

    return remainingAmount;
  }
}
