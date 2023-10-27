import { IsInt, IsPositive } from 'class-validator';
import {
  CREATE_REMAINING_AMOUNT_VALIDATION_MESSAGE,
  TRAINING_ID_VALIDATION_MESSAGE,
} from './constants';

export class CreateBalanceDto {
  @IsPositive({ message: TRAINING_ID_VALIDATION_MESSAGE })
  @IsInt({ message: TRAINING_ID_VALIDATION_MESSAGE })
  trainingId: number;

  @IsPositive({ message: CREATE_REMAINING_AMOUNT_VALIDATION_MESSAGE })
  @IsInt({ message: CREATE_REMAINING_AMOUNT_VALIDATION_MESSAGE })
  remainingAmount: number;
}
