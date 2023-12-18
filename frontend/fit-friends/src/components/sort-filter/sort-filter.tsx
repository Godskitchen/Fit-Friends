import { ChangeEvent, MutableRefObject, useEffect } from 'react';

type SortFilterProps = {
  timeoutRef: MutableRefObject<NodeJS.Timeout | null>;
  formRef: MutableRefObject<HTMLFormElement | null>;
  setterSortValue: React.Dispatch<React.SetStateAction<string>>;
  currentSortValue: string;
  filterValues: Record<string, string>;
  className: string;
}

export default function SortFilter({
  timeoutRef,
  formRef,
  setterSortValue,
  currentSortValue,
  filterValues,
  className
}: SortFilterProps): JSX.Element {

  const handleBtnChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    setterSortValue(target.value);

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
    <div className={`${className}-form__block`}>
      <h3 className={`${className}-form__title ${className}-form__title--sort`}>Сортировка</h3>
      <div className="btn-radio-sort">
        {Object.entries(filterValues).map(([key, value]) => (
          <label key={key}>
            <input
              type="radio"
              name="sort"
              value={key}
              onChange={handleBtnChange}
              checked={key === currentSortValue}
            />
            <span className="btn-radio-sort__label">{value}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
