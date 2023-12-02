import { NAME_PATTERN, NAME_VALIDATION_MESSAGE } from './constants';

const isValidName = (name: string) => RegExp(NAME_PATTERN).test(name);

export const nameValidationHandler = (name: string) => {
  const isValid = isValidName(name);
  return isValid || `${NAME_VALIDATION_MESSAGE}`;
};

