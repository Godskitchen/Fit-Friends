import { PRICE, PRICE_VALIDATION_MESSAGE } from './constants';

export const priceValidationHandler = (price: number) =>
  (price >= PRICE.MIN && price <= PRICE.MAX && Number.isInteger(+price)) || PRICE_VALIDATION_MESSAGE;
