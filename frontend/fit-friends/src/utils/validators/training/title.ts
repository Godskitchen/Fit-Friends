import { TITLE_LENGTH, TITLE_VALIDATION_MESSAGE } from './constants';

export const titleValidationHandler = (title: string) =>
  (title.length >= TITLE_LENGTH.MIN && title.length <= TITLE_LENGTH.MAX) || TITLE_VALIDATION_MESSAGE;
