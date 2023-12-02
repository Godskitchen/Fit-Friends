import { ACHIEVEMENTS, ACHIEVEMENTS_VALIDATION_MESSAGE } from './constants';

export const descriptionValidationHandler = (value: string) => {
  if (value.length < ACHIEVEMENTS.MIN || value.length > ACHIEVEMENTS.MAX) {
    return ACHIEVEMENTS_VALIDATION_MESSAGE;
  }

  return true;
};
