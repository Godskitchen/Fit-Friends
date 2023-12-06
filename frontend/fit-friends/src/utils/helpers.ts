export const queryParamsRangeBuilder = (
  currMinValue: string,
  currMaxValue: string,
  maxPossibleValue: number,
  minPossibleValue: number
) => {
  let value = '';
  if (currMinValue && currMaxValue) {
    value = `${currMinValue},${currMaxValue}`;
  } else if (!currMinValue && currMaxValue) {
    value = `${minPossibleValue},${currMaxValue}`;
  } else if (currMinValue && !currMaxValue) {
    value = `${currMinValue},${maxPossibleValue}`;
  }

  return value;
};

export const queryParamDurationBuilder = (durationsState: Record<string, boolean>) => {
  let durations = '';
  Object.entries(durationsState).forEach(([key, value]) => {
    if (value) {
      durations = durations.concat(key, ' ');
    }
  });
  return durations.trim().replaceAll(' ', ',');
};

