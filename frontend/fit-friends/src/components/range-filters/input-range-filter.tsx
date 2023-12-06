import { ChangeEvent, MutableRefObject, useEffect, useRef } from 'react';

type InputRangeFilterProps = {
  timeoutRef: MutableRefObject<NodeJS.Timeout | null>;
  formRef: MutableRefObject<HTMLFormElement | null>;
  setterMaxFieldValue: React.Dispatch<React.SetStateAction<string>>;
  setterMinFieldValue: React.Dispatch<React.SetStateAction<string>>;
  setterMaxRangeValue: React.Dispatch<React.SetStateAction<number>>;
  setterMinRangeValue: React.Dispatch<React.SetStateAction<number>>;
  currMaxValue: number;
  currMinValue: number;
  currMaxFieldValue: string;
  currMinFieldValue: string;
  maxPossibleValue: number;
  minPossibleValue: number;
  filterName: string;
  title: string;
}

export default function InputRangeFilter(
  {
    timeoutRef,
    formRef,
    setterMaxFieldValue,
    setterMinFieldValue,
    setterMaxRangeValue,
    setterMinRangeValue,
    currMaxValue,
    currMinValue,
    currMaxFieldValue,
    currMinFieldValue,
    maxPossibleValue,
    minPossibleValue,
    filterName,
    title
  }: InputRangeFilterProps
): JSX.Element {

  const rangeBarRef = useRef<HTMLDivElement | null>(null);

  const handleMinPriceRangeChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(Number(target.value), currMaxValue);
    const newFieldValue = Math.min(Number(target.value), currMaxFieldValue ? Number(currMaxFieldValue) : maxPossibleValue).toString();
    setterMinRangeValue(newValue);
    setterMinFieldValue(newFieldValue);
    if (rangeBarRef.current) {
      rangeBarRef.current.style.left = `${((Number(target.value) - minPossibleValue) / (maxPossibleValue - minPossibleValue) ) * 100}%`;
    }
  };

  const handleMaxPriceRangeChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(Number(target.value), currMinValue);
    const newFieldValue = Math.max(Number(target.value), currMinFieldValue ? Number(currMinFieldValue) : minPossibleValue).toString();
    setterMaxRangeValue(newValue);
    setterMaxFieldValue(newFieldValue);
    if (rangeBarRef.current) {
      rangeBarRef.current.style.right = `${100 - ((Number(target.value) - minPossibleValue) / (maxPossibleValue - minPossibleValue)) * 100}%`;
    }
  };

  const minPriceFieldChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    setterMinFieldValue(target.value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {target.blur();}, 1000);
  };

  const maxPriceFieldChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    setterMaxFieldValue(target.value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {target.blur();}, 1000);
  };

  const minPriceFieldBlur = ({target}: ChangeEvent<HTMLInputElement>) => {
    if (target.value === '') {
      setterMinFieldValue(target.value);
      setterMinRangeValue(minPossibleValue);
    } else {
      const newFieldValue = Math.min(Number(target.value), currMaxFieldValue ? Number(currMaxFieldValue) : maxPossibleValue).toFixed();
      const newValue = Math.min(Number(target.value), currMaxValue ? currMaxValue : maxPossibleValue);
      setterMinFieldValue(newFieldValue);
      setterMinRangeValue(newValue);
    }

    if (rangeBarRef.current) {
      rangeBarRef.current.style.left = `${((Number(target.value) - minPossibleValue) / (maxPossibleValue - minPossibleValue) ) * 100}%`;
    }
    formRef.current?.requestSubmit();
  };

  const maxPriceFieldBlur = ({target}: ChangeEvent<HTMLInputElement>) => {
    if (target.value === '') {
      setterMaxFieldValue(target.value);
      setterMaxRangeValue(maxPossibleValue);
    } else {
      const newFieldValue = Math.max(Number(target.value), currMinFieldValue ? Number(currMinFieldValue) : minPossibleValue).toFixed();
      const newValue = Math.max(Number(target.value), currMinValue ? currMinValue : minPossibleValue);
      setterMaxFieldValue(newFieldValue);
      setterMaxRangeValue(newValue);
    }

    if (rangeBarRef.current) {
      rangeBarRef.current.style.right = `${100 - ((Number(target.value) - minPossibleValue) / (maxPossibleValue - minPossibleValue)) * 100}%`;
    }
    formRef.current?.requestSubmit();
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
    <div className={`my-training-form__block my-training-form__block--${filterName}`}>
      <h4 className="my-training-form__block-title">{title}</h4>
      <div className={`filter-${filterName}`}>
        <div className={`filter-${filterName}__input-text filter-${filterName}__input-text--min`}>
          <input
            type="number" id={`${filterName}-min`}
            name={`${filterName}-min`}
            value={currMinFieldValue}
            onChange={minPriceFieldChange}
            onBlur={minPriceFieldBlur}
          />
          <label htmlFor={`${filterName}-min`}>от</label>
        </div>
        <div className={`filter-${filterName}__input-text filter-${filterName}__input-text--max`}>
          <input
            type="number" id={`${filterName}-max`}
            name={`${filterName}-max`}
            value={currMaxFieldValue}
            onChange={maxPriceFieldChange}
            onBlur={maxPriceFieldBlur}
          />
          <label htmlFor={`${filterName}-max`}>до</label>
        </div>
      </div>
      <div className="filter-range">
        <div className="slider">
          <div ref={rangeBarRef} className="progress">
            <span className="visually-hidden">Полоса прокрутки</span>
          </div>
        </div>
        <div className="range-input">
          <input
            type="range" className="range-min"
            min={minPossibleValue} max={maxPossibleValue}
            value={currMinValue} step="1"
            onChange={handleMinPriceRangeChange}
            onMouseUp={handleMouseUpPrice}
          />
          <span className="visually-hidden">Минимальное значение</span>
          <input
            type="range" className="range-max"
            min={minPossibleValue} max={maxPossibleValue}
            value={currMaxValue} step="1"
            onChange={handleMaxPriceRangeChange}
            onMouseUp={handleMouseUpPrice}
          />
          <span className="visually-hidden">Максимальное значение</span>
        </div>
      </div>
    </div>
  );
}
