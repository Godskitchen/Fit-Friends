import { TrainingRequestStatus } from '@libs/shared/app-types';
import { IsEnum, IsUUID } from 'class-validator';
import {
  REQUEST_ID_VALIDATION_MESSAGE,
  STATUS_VALIDATION_MESSAGE,
  UUID_VERSION,
} from './constants';

export class UpdateStatusDto {
  @IsUUID(UUID_VERSION, { message: REQUEST_ID_VALIDATION_MESSAGE })
  requestId: string;

  @IsEnum(TrainingRequestStatus, { message: STATUS_VALIDATION_MESSAGE })
  status: TrainingRequestStatus;
}
