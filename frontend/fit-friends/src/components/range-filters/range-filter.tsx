import { ChangeEvent, MutableRefObject, useEffect, useRef } from 'react';

type RangeFilterProps = {
  timeoutRef: MutableRefObject<NodeJS.Timeout | null>;
  formRef: MutableRefObject<HTMLFormElement | null>;
  setterMaxRangeValue: React.Dispatch<React.SetStateAction<number>>;
  setterMinRangeValue: React.Dispatch<React.SetStateAction<number>>;
  currMaxValue: number;
  currMinValue: number;
  maxPossibleValue: number;
  minPossibleValue: number;
  filterName: string;
  title: string;
  className: string;
}

export default function RangeFilter(
  {
    timeoutRef,
    formRef,
    setterMaxRangeValue,
    setterMinRangeValue,
    currMaxValue,
    currMinValue,
    maxPossibleValue,
    minPossibleValue,
    filterName,
    title,
    className
  }: RangeFilterProps
): JSX.Element {

  const rangeBarRef = useRef<HTMLDivElement | null>(null);

  const handleMinPriceRangeChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(Number(target.value), currMaxValue);
    setterMinRangeValue(newValue);
    if (rangeBarRef.current) {
      rangeBarRef.current.style.left = `${((Number(target.value) - minPossibleValue) / (maxPossibleValue - minPossibleValue) ) * 100}%`;
    }
  };

  const handleMaxPriceRangeChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(Number(target.value), currMinValue);
    setterMaxRangeValue(newValue);
    if (rangeBarRef.current) {
      rangeBarRef.current.style.right = `${100 - ((Number(target.value) - minPossibleValue) / (maxPossibleValue - minPossibleValue)) * 100}%`;
    }
  };

  const handleMouseUpPrice = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 1000);
  };

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [timeoutRef]);

  return (
    <div className={`${className}-form__block ${className}-form__block--${filterName}`}>
      <h4 className={`${className}-form__block-title`}>{title}</h4>
      <div className={`filter-${filterName}`}>
        <div className="filter-range">
          <div className="slider">
            <div ref={rangeBarRef} className="progress">
              <span className="visually-hidden">Полоса прокрутки</span>
            </div>
          </div>
          <div className={`range-input range-input--${filterName}`}>
            <input
              type="range" className="range-min"
              min={minPossibleValue} max={maxPossibleValue}
              value={currMinValue} step="1"
              onChange={handleMinPriceRangeChange}
              onMouseUp={handleMouseUpPrice}
            />
            <span className="visually-hidden">Минимальное значение</span>
            <span className="range-min-value">{currMinValue}</span>
            <input
              type="range" className="range-max"
              min={minPossibleValue} max={maxPossibleValue}
              value={currMaxValue} step="1"
              onChange={handleMaxPriceRangeChange}
              onMouseUp={handleMouseUpPrice}
            />
            <span className="visually-hidden">Максимальное значение</span>
            <span className="range-max-value">{currMaxValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
