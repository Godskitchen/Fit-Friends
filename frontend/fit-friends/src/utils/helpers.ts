import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

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

export const queryParamCheckBoxBuilder = (checkBoxGroupState: Record<string, boolean>) => {
  let values = '';
  Object.entries(checkBoxGroupState).forEach(([key, value]) => {
    if (value) {
      values = values.concat(key, ' ');
    }
  });
  return values.trim().replaceAll(' ', ',');
};

export const compareArrays = <T>(arr1: T, arr2: T): boolean => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
};

export const formatVideoDurationTime = (rawTime: number): string => {
  const normalizedValue = dayjs.duration(rawTime, 'seconds');
  return normalizedValue.format(`${normalizedValue.hours() === 0 ? '' : 'HH[:]'}mm[:]ss`);
};

export const formatNumber = (number: number): string => {
  const reversedNumber = `${number}`.split('').reverse().join('');
  const formattedNumber = reversedNumber.replace(/(\d{3})/g, '$1 ').trim();
  return formattedNumber.split('').reverse().join('');
};

