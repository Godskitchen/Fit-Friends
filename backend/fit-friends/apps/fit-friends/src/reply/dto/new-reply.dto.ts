import { IsInt, IsPositive, Length, Max, Min } from 'class-validator';
import {
  RATING_VALIDATION_MESSAGE,
  RATING_VALUE,
  TEXT_LENGTH,
  TEXT_VALIDATION_MESSAGE,
  TRAINING_ID_VALIDATION_MESSAGE,
} from './constants';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class NewReplyDto {
  @ApiProperty({
    description: 'id тренировки. Целое положительное число',
    example: 2,
  })
  @IsPositive({ message: TRAINING_ID_VALIDATION_MESSAGE })
  @IsInt({ message: TRAINING_ID_VALIDATION_MESSAGE })
  @Type(() => Number)
  trainingId: number;

  @ApiProperty({
    description: `Оценка тренировки. Целое число от ${RATING_VALUE.MIN} до ${RATING_VALUE.MAX}`,
    maximum: RATING_VALUE.MAX,
    minimum: RATING_VALUE.MIN,
    example: RATING_VALUE.MAX,
  })
  @Max(RATING_VALUE.MAX, { message: RATING_VALIDATION_MESSAGE })
  @Min(RATING_VALUE.MIN, { message: RATING_VALIDATION_MESSAGE })
  @IsInt({ message: RATING_VALIDATION_MESSAGE })
  @Type(() => Number)
  rating: number;

  @ApiProperty({
    description: `Текст отзыва о тренировки. Длина от ${TEXT_LENGTH.MIN} до ${TEXT_LENGTH.MAX} символов`,
    minLength: TEXT_LENGTH.MIN,
    maxLength: TEXT_LENGTH.MAX,
    example: 'Очень хорошая тренировка, стоит своих денег',
  })
  @Length(TEXT_LENGTH.MIN, TEXT_LENGTH.MAX, {
    message: TEXT_VALIDATION_MESSAGE,
  })
  text: string;
}
