export const getRandomNumber = (
  min: number,
  max: number,
  numAfterDigit = 0,
): number | typeof NaN => {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < 0) {
    return NaN;
  }

  const lowerBound = Math.min(min, max);
  const upperBound = Math.max(min, max);

  return +(Math.random() * (upperBound - lowerBound) + lowerBound).toFixed(
    numAfterDigit,
  );
};

export const getRandomArrItem = <T>(array: T[]): T =>
  array[getRandomNumber(0, array.length - 1)];
