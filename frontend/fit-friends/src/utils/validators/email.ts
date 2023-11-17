import { EMAIL_PATTERN, EMAIL_VALIDATION_MESSAGE } from './constants';

const isValidEmail = (email: string) => RegExp(EMAIL_PATTERN).test(email);

export const emailValidationHandler = (email: string) => {
  const isValid = isValidEmail(email);
  return isValid || `${EMAIL_VALIDATION_MESSAGE}`;
};
