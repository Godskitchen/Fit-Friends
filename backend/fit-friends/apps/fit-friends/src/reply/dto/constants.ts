export enum RATING_VALUE {
  MIN = 1,
  MAX = 5,
}

export enum TEXT_LENGTH {
  MIN = 100,
  MAX = 1024,
}

export const TRAINING_ID_VALIDATION_MESSAGE =
  '$property: id тренировки должен быть целым положительным числом';
export const TEXT_VALIDATION_MESSAGE = `$property: Текст отзыва должен иметь длину от ${TEXT_LENGTH.MIN} до ${TEXT_LENGTH.MAX} символов`;
export const RATING_VALIDATION_MESSAGE = `$property: Рейтинг отзыва должен быть целым числом в диапазоне от ${RATING_VALUE.MIN} до ${RATING_VALUE.MAX}`;
