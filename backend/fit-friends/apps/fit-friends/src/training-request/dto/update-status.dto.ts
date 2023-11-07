import { TrainingRequestStatus } from '@libs/shared/app-types';
import { IsEnum, IsUUID } from 'class-validator';
import {
  REQUEST_ID_VALIDATION_MESSAGE,
  STATUS_VALIDATION_MESSAGE,
  UUID_VERSION,
} from './constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'id заявки на тренировку. uuid-строка',
    example: '543k5jff-kkf3kk-343kk-343',
  })
  @IsUUID(UUID_VERSION, { message: REQUEST_ID_VALIDATION_MESSAGE })
  requestId: string;

  @ApiProperty({
    description: `Обновленный статус заявки. Доступные варианты: ${TrainingRequestStatus.Accepted} или ${TrainingRequestStatus.Declined}`,
    enum: TrainingRequestStatus,
    example: `${TrainingRequestStatus.Accepted}`,
  })
  @IsEnum(TrainingRequestStatus, { message: STATUS_VALIDATION_MESSAGE })
  status: TrainingRequestStatus;
}
