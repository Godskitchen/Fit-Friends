import { ABOUT_INFO_LENGTH, ABOUT_INFO_VALIDATION_MESSAGE } from './constants';

export const aboutInfoValidationHandler = (value: string) => {
  if(value.length === 0) {
    return true;
  }

  if (value.length < ABOUT_INFO_LENGTH.MIN || value.length > ABOUT_INFO_LENGTH.MAX) {
    return ABOUT_INFO_VALIDATION_MESSAGE;
  }

  return true;
};

