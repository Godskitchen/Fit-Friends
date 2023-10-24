import { OrderType, PaymentType } from '@libs/shared/app-types';

export enum TRAINING_COUNT {
  MIN = 1,
  MAX = 50,
}

export const PAYMENT_TYPE_VALIDATION_MESSAGE = `$property: Способ оплаты может принимать только следующие значения: ${Object.values(
  PaymentType,
).join(', ')}`;

export const TRAINING_COUNT_VALIDATION_MESSAGE = `$property: Количество тренировок может быть целым числом от ${TRAINING_COUNT.MIN} до ${TRAINING_COUNT.MAX}`;
export const ORDER_TYPE_VALIDATION_MESSAGE = `$property: Тип заказа может принимать только следующие значения ${Object.values(
  OrderType,
).join(', ')}`;

export const TRAINING_ID_VALIDATION_MESSAGE = `$property: Id тренировки может быть только целым положительным числом`;
