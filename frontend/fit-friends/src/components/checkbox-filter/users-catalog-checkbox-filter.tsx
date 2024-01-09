import { ChangeEvent, MutableRefObject, useEffect, useState } from 'react';

type CheckboxFilterProps = {
  checkBoxBtnValues: Record<string, string>;
  filterName: string;
  title: string;
  timeoutRef: MutableRefObject<NodeJS.Timeout | null>;
  formRef: MutableRefObject<HTMLFormElement | null>;
  setterCheckboxValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  currentCheckBoxesGroupState: Record<string, boolean>;
}

export default function UsersCatalogCheckBoxFilter(
  {
    checkBoxBtnValues,
    title,
    filterName,
    timeoutRef,
    formRef,
    setterCheckboxValues,
    currentCheckBoxesGroupState
  }: CheckboxFilterProps): JSX.Element {

  const handleCheckboxChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    setterCheckboxValues({
      ...currentCheckBoxesGroupState,
      [target.value]: !currentCheckBoxesGroupState[target.value]
    });

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

  const [isShowedAll, setShowAll] = useState(Object.entries(checkBoxBtnValues).length <= 5);

  return (
    <div className={`user-catalog-form__block user-catalog-form__block--${filterName}`}>
      <h4 className="user-catalog-form__block-title">{title}</h4>
      <ul className="user-catalog-form__check-list">
        {
          Object.entries(checkBoxBtnValues).map(([key, value], index) => (
            <li
              className={`user-catalog-form__check-list-item ${index > 4 && !isShowedAll ? 'visually-hidden' : ''}`}
              key={key}
              data-testid="checkbox-filter"
            >
              <div className="custom-toggle custom-toggle--checkbox">
                <label>
                  <input
                    type="checkbox"
                    value={key}
                    name={filterName}
                    checked={currentCheckBoxesGroupState[key]}
                    onChange={handleCheckboxChange}
                  />
                  <span className="custom-toggle__icon">
                    <svg width="9" height="6" aria-hidden="true">
                      <use xlinkHref="#arrow-check"></use>
                    </svg>
                  </span>
                  <span className="custom-toggle__label">{value}</span>
                </label>
              </div>
            </li>
          ))
        }
      </ul>
      <button
        className={`btn-show-more user-catalog-form__btn-show ${isShowedAll ? 'visually-hidden' : ''}`}
        type="button"
        onClick={() => {setShowAll(true);}}
      >
        <span>Посмотреть все</span>
        <svg className="btn-show-more__icon" width="10" height="4" aria-hidden="true">
          <use xlinkHref="#arrow-down"></use>
        </svg>
      </button>
    </div>
  );
}
