import { IsInt, IsPositive, Length, Max, Min } from 'class-validator';
import {
  RATING_VALIDATION_MESSAGE,
  RATING_VALUE,
  TEXT_LENGTH,
  TEXT_VALIDATION_MESSAGE,
  TRAINING_ID_VALIDATION_MESSAGE,
} from './constants';

export class NewReplyDto {
  @IsPositive({ message: TRAINING_ID_VALIDATION_MESSAGE })
  @IsInt({ message: TRAINING_ID_VALIDATION_MESSAGE })
  trainingId: number;

  @Max(RATING_VALUE.MAX, { message: RATING_VALIDATION_MESSAGE })
  @Min(RATING_VALUE.MIN, { message: RATING_VALIDATION_MESSAGE })
  @IsInt({ message: RATING_VALIDATION_MESSAGE })
  rating: number;

  @Length(TEXT_LENGTH.MIN, TEXT_LENGTH.MAX, {
    message: TEXT_VALIDATION_MESSAGE,
  })
  text: string;
}
