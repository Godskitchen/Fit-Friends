import { Fragment } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { DurationFieldValue, TrainingDuration } from 'src/types/constants';
import { QuestionnaireUserInputs } from 'src/types/forms.type';

type TrainingDurationButtonProps = {
  durations: TrainingDuration[];
  register: UseFormRegister<QuestionnaireUserInputs>;
}


export default function trainingDurationButtons({durations, register}: TrainingDurationButtonProps) : JSX.Element {
  return (
    <Fragment>
      <span className="questionnaire-user__legend">Сколько времени вы готовы уделять на тренировку в день</span>
      <div className="custom-toggle-radio custom-toggle-radio--big questionnaire-user__radio">
        {durations.map((duration) => (
          <div className="custom-toggle-radio__block" key={duration}>
            <label>
              <input type="radio" value={duration} {...register('trainingDuration')}/>
              <span className="custom-toggle-radio__icon"></span>
              <span className="custom-toggle-radio__label">{DurationFieldValue[duration]}</span>
            </label>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
