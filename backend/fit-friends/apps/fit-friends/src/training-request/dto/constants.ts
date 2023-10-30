import { TrainingRequestStatus } from '@libs/shared/app-types';
export const UUID_VERSION = 4;

export const STATUS_VALIDATION_MESSAGE = `$property: Статус может принимать только следующие значения: ${Object.values(
  TrainingRequestStatus,
).join(', ')}`;

export const REQUEST_ID_VALIDATION_MESSAGE =
  '$property: id запроса должно быть в формате UUID строки';
