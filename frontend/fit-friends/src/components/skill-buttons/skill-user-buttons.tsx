import { Fragment } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { SkillLevel } from 'src/types/constants';
import { QuestionnaireUserInputs } from 'src/types/forms.type';

type SkillButtonsProps = {
  skills: SkillLevel[];
  register: UseFormRegister<QuestionnaireUserInputs>;
}

export default function SkillUserButtons({skills, register}: SkillButtonsProps) : JSX.Element {

  return (
    <Fragment>
      <span className="questionnaire-coach__legend">Ваш уровень</span>
      <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-coach__radio">
        {
          skills.map((skill) => (
            <div className="custom-toggle-radio__block" key={skill}>
              <label>
                <input type="radio" value={skill} {...register('skillLevel')} />
                <span className="custom-toggle-radio__icon"></span>
                <span className="custom-toggle-radio__label">{skill}</span>
              </label>
            </div>
          ))
        }
      </div>
    </Fragment>
  );
}
