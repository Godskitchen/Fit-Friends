import { CALORIES_TO_BURN, CALORIES_TO_BURN_VALIDATION_MESSAGE, DAILY_CALORIES_INTAKE, DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE } from './constants';

export const caloriesToBurnValidationHandler = (value: number) => {
  if (+value > CALORIES_TO_BURN.MAX || +value < CALORIES_TO_BURN.MIN || !Number.isInteger(+value)) {
    return CALORIES_TO_BURN_VALIDATION_MESSAGE;
  }

  return true;
};

export const caloriesIntakeValidationHandler = (value: number) => {
  if (+value > DAILY_CALORIES_INTAKE.MAX || +value < DAILY_CALORIES_INTAKE.MIN || !Number.isInteger(+value)) {
    return DAILY_CALORIES_INTAKE_VALIDATION_MESSAGE;
  }

  return true;
};
