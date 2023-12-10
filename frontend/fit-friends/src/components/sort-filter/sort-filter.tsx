import { ChangeEvent, MutableRefObject, useEffect } from 'react';

type SortFilterProps = {
  timeoutRef: MutableRefObject<NodeJS.Timeout | null>;
  formRef: MutableRefObject<HTMLFormElement | null>;
  setterSortValue: React.Dispatch<React.SetStateAction<string>>;
  currentSortValue: string;
}

const SortFilterBtnValue: Record<string, string> = {
  Trainer: 'Тренеры',
  User: 'Пользователи'
};

export default function SortFilter({timeoutRef, formRef, setterSortValue, currentSortValue}: SortFilterProps): JSX.Element {

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
    <div className="user-catalog-form__block">
      <h3 className="user-catalog-form__title user-catalog-form__title--sort">Сортировка</h3>
      <div className="btn-radio-sort">
        {Object.entries(SortFilterBtnValue).map(([key, value]) => (
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
