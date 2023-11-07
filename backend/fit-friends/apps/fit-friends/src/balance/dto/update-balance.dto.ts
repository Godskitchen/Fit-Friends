import { IsInt, IsUUID, Min } from 'class-validator';
import {
  BALANCE_ID_VALIDATION_MESSAGE,
  MIN_REMAINING_AMOUNT,
  UPDATE_REMAINING_AMOUNT_VALIDATION_MESSAGE,
  UUID_VERSION,
} from './constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDto {
  @ApiProperty({
    description: 'id баланса. UUID-строка',
    type: 'uuid',
    example: '3432ddkk-3k343kk-k34324k-343kk',
  })
  @IsUUID(UUID_VERSION, { message: BALANCE_ID_VALIDATION_MESSAGE })
  balanceId: string;

  @ApiProperty({
    description: `Оставшееся число тренировок. Минимальное значение ${MIN_REMAINING_AMOUNT}`,
    minimum: MIN_REMAINING_AMOUNT,
    example: 2,
  })
  @Min(MIN_REMAINING_AMOUNT, {
    message: UPDATE_REMAINING_AMOUNT_VALIDATION_MESSAGE,
  })
  @IsInt({ message: UPDATE_REMAINING_AMOUNT_VALIDATION_MESSAGE })
  remainingAmount: number;
}
