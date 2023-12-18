import { ApiProperty } from '@nestjs/swagger';
import { BalanceRdo } from './balance.rdo';
import { Expose, Type } from 'class-transformer';

export class BalanceListRdo {
  @ApiProperty({ type: [BalanceRdo] })
  @Expose()
  @Type(() => BalanceRdo)
  balanceList: BalanceRdo[];

  @ApiProperty({ example: 6 })
  @Expose()
  totalTrainingsCount: number;
}
