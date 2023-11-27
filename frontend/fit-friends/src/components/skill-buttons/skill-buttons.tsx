import { Fragment } from 'react';
import { FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';
import { SkillLevel } from 'src/types/constants';

type SkillLeveFieldPath<T extends FieldValues> = {
  skillLevel: FieldPath<T>;
}

type SkillButtonsProps<T extends FieldValues> = {
  skills: SkillLevel[];
  register: UseFormRegister<T>;
  fieldPaths: SkillLeveFieldPath<T>;
}

const SkillButtonValue = {
  Beginner: 'Новичок',
  Amateur: 'Любитель',
  Pro: 'Профессионал'
};

export default function SkillButtons<T extends FieldValues>({skills, register, fieldPaths}: SkillButtonsProps<T>) : JSX.Element {

  return (
    <Fragment>
      <span className="questionnaire-coach__legend">Ваш уровень</span>
      <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-coach__radio">
        {
          skills.map((skill) => (
            <div className="custom-toggle-radio__block" key={skill}>
              <label>
                <input type="radio" value={skill} {...register(fieldPaths.skillLevel)} />
                <span className="custom-toggle-radio__icon"></span>
                <span className="custom-toggle-radio__label">{SkillButtonValue[skill]}</span>
              </label>
            </div>
          ))
        }
      </div>
    </Fragment>
  );
}
