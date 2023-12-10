import { UseFormRegister } from 'react-hook-form';
import { Gender, TrainingGenderFieldValue } from 'src/types/constants';
import { CreateTrainingInputs } from 'src/types/forms.type';

type GenderButtonsProps = {
  register: UseFormRegister<CreateTrainingInputs>;
}


export default function TrainingGenderButtons({register}: GenderButtonsProps): JSX.Element {
  return (
    <div className="create-training__radio-wrapper">
      <span className="create-training__label">Кому подойдет тренировка</span>
      <br/>
      <div className="custom-toggle-radio create-training__radio">
        {Object.values(Gender).map((gender) => (
          <div className="custom-toggle-radio__block" key={gender}>
            <label>
              <input type="radio" value={gender} {...register('gender')} />
              <span className="custom-toggle-radio__icon"></span>
              <span className="custom-toggle-radio__label">{TrainingGenderFieldValue[gender]}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

