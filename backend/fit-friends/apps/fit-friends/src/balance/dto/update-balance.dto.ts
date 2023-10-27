import { IsInt, IsUUID, Min } from 'class-validator';
import {
  BALANCE_ID_VALIDATION_MESSAGE,
  MIN_REMAINING_AMOUNT,
  UPDATE_REMAINING_AMOUNT_VALIDATION_MESSAGE,
  UUID_VERSION,
} from './constants';

export class UpdateBalanceDto {
  @IsUUID(UUID_VERSION, { message: BALANCE_ID_VALIDATION_MESSAGE })
  balanceId: string;

  @Min(MIN_REMAINING_AMOUNT, {
    message: UPDATE_REMAINING_AMOUNT_VALIDATION_MESSAGE,
  })
  @IsInt({ message: UPDATE_REMAINING_AMOUNT_VALIDATION_MESSAGE })
  remainingAmount: number;
}
