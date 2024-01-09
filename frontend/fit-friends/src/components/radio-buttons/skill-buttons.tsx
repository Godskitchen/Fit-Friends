import { ChangeEvent, MutableRefObject, useEffect } from 'react';
import { SkillFieldValue, SkillLevel } from 'src/types/constants';

type SkillButtonProps = {
  timeoutRef: MutableRefObject<NodeJS.Timeout | null>;
  formRef: MutableRefObject<HTMLFormElement | null>;
  setterSkillValue: React.Dispatch<React.SetStateAction<string>>;
  currentSkillValue: string;
}

export default function SkillButtons({setterSkillValue, currentSkillValue, timeoutRef, formRef} : SkillButtonProps) : JSX.Element {

  const handleButtonChange = ({target}: ChangeEvent<HTMLInputElement>) => {
    setterSkillValue(target.value);

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
    <div className="user-catalog-form__block user-catalog-form__block--level">
      <h4 className="user-catalog-form__block-title">Ваш уровень</h4>
      <div className="custom-toggle-radio">
        {
          Object.values(SkillLevel).map((skill) => (
            <div className="custom-toggle-radio__block" key={skill}>
              <label>
                <input
                  type="radio"
                  value={skill}
                  name='skillLevel'
                  checked={skill === currentSkillValue}
                  onChange={handleButtonChange}
                  data-testid={skill}
                />
                <span className="custom-toggle-radio__icon"></span>
                <span className="custom-toggle-radio__label">{SkillFieldValue[skill]}</span>
              </label>
            </div>
          ))
        }
      </div>
    </div>
  );
}
