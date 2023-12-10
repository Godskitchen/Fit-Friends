import { ChangeEvent, MutableRefObject, useEffect } from 'react';

type CheckboxFilterProps = {
  title: string;
  filterName: string;
  timeoutRef: MutableRefObject<NodeJS.Timeout | null>;
  formRef: MutableRefObject<HTMLFormElement | null>;
  checkBoxBtnValues: Record<string, string>;
  setterCheckboxValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  currentCheckBoxesGroupState: Record<string, boolean>;
}

export default function TrainingFormCheckBoxFilter(
  {
    title,
    filterName,
    timeoutRef,
    formRef,
    setterCheckboxValues,
    currentCheckBoxesGroupState,
    checkBoxBtnValues
  }: CheckboxFilterProps
): JSX.Element {


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

  return (
    <div className={`my-training-form__block my-training-form__block--${filterName}`}>
      <h4 className="my-training-form__block-title">{title}</h4>
      <ul className="my-training-form__check-list">
        {
          Object.entries(checkBoxBtnValues).map(([key, value]) => (
            <li className="my-training-form__check-list-item" key={key}>
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
    </div>
  );
}
