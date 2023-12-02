import { PASSWORD_LENGTH, PASSWORD_VALIDATION_MESSAGE } from './constants';

export const passwordValidationHandler = (password: string) => {
  if (password.length < PASSWORD_LENGTH.MIN || password.length > PASSWORD_LENGTH.MAX ) {
    return PASSWORD_VALIDATION_MESSAGE;
  }
  return true;
};
