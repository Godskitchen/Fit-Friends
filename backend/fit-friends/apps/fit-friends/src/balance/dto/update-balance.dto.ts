import { IsInt, IsPositive, Min } from 'class-validator';
import {
  MIN_REMAINING_AMOUNT,
  TRAINING_ID_VALIDATION_MESSAGE,
  UPDATE_REMAINING_AMOUNT_VALIDATION_MESSAGE,
} from './constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDto {
  @ApiProperty({
    description: 'id тренировки. Целое положительное число',
    minimum: 0,
    example: 10,
  })
  @IsPositive({ message: TRAINING_ID_VALIDATION_MESSAGE })
  @IsInt({ message: TRAINING_ID_VALIDATION_MESSAGE })
  trainingId: number;

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
