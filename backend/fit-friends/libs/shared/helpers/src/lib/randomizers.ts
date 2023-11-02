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

export const getUniqueRandomArrItems = <T>(
  elementsCount: number,
  sourceArray: T[],
): T[] => {
  const uniqueSourceArray = Array.from(new Set(sourceArray));

  if (elementsCount > uniqueSourceArray.length) {
    return uniqueSourceArray;
  }

  const resultElements: T[] = [];

  for (let i = 0; i < elementsCount; i++) {
    let element = getRandomArrItem(uniqueSourceArray);
    while (resultElements.includes(element)) {
      element = getRandomArrItem(uniqueSourceArray);
    }

    resultElements.push(element);
  }

  return resultElements;
};

export function randomUniqueItem<T>(array: T[]) {
  const set = new Set(array);
  return function (array: T[]) {
    const element = getRandomArrItem(array);
    set.delete(element);
  };
}
