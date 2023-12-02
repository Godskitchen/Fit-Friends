import { PRICE_MIN, PRICE_VALIDATION_MESSAGE } from './constants';

export const priceValidationHandler = (price: number) =>
  (price >= PRICE_MIN && Number.isInteger(+price)) || PRICE_VALIDATION_MESSAGE;
