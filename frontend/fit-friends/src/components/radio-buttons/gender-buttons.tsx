import { UseFormRegister } from 'react-hook-form';
import { Gender, GenderFieldValue } from 'src/types/constants';
import { RegisterInputs } from 'src/types/forms.type';

type GenderButtonsProps = {
  register: UseFormRegister<RegisterInputs>;
}

export default function GenderButtons({register}: GenderButtonsProps): JSX.Element {
  return (
    <div className="sign-up__radio">
      <span className="sign-up__label">Пол</span>
      <div className="custom-toggle-radio custom-toggle-radio--big">
        {Object.values(Gender).map((gender) => (
          <label key={gender}>
            <input type="radio" value={gender} {...register('gender')} />
            <span className="custom-toggle-radio__icon"></span>
            <span className="custom-toggle-radio__label">{GenderFieldValue[gender]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
