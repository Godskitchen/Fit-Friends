import { TEXT_LENGTH, TEXT_VALIDATION_MESSAGE } from './constants';

export const replyTextValidationHandler = (value: string) => {
  if (value.length < TEXT_LENGTH.MIN || value.length > TEXT_LENGTH.MAX) {
    return TEXT_VALIDATION_MESSAGE;
  }

  return true;
};
