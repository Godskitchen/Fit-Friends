import { TRAINING_TYPE_COUNT, TRAINING_TYPE_COUNT_VALIDATION_MESSAGE } from './constants';

export const specialisationValidationHandler = (selectedSpecs: string[]) =>
  selectedSpecs.length >= TRAINING_TYPE_COUNT.MIN || TRAINING_TYPE_COUNT_VALIDATION_MESSAGE;
