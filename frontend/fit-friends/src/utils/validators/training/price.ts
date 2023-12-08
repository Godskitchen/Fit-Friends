import { PRICE, PRICE_VALIDATION_MESSAGE } from './constants';

export const priceValidationHandler = (price: number) =>
  (price >= PRICE.MIN && price <= PRICE.MAX && Number.isInteger(+price)) || PRICE_VALIDATION_MESSAGE;

export const priceStringValidationHandler = (price: string) => {
  if (price === '' || price.split(' ')[0] === '') {
    return 'Поле обязательно для заполнения';
  }

  const [value,] = price.split(' ');
  return (+value.trim() >= PRICE.MIN && +value.trim() <= PRICE.MAX && Number.isInteger(+value.trim())) || PRICE_VALIDATION_MESSAGE;
};
