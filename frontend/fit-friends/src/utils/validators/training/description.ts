import { DESCRIPTION_VALIDATION_MESSAGE, TRAINING_DESCRIPTION_LENGTH } from './constants';

export const descriptionValidationHandler = (value: string) => {
  if (value.length < TRAINING_DESCRIPTION_LENGTH.MIN || value.length > TRAINING_DESCRIPTION_LENGTH.MAX) {
    return DESCRIPTION_VALIDATION_MESSAGE;
  }

  return true;
};
