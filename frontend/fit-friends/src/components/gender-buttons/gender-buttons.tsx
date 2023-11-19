import { UseFormRegister } from 'react-hook-form';
import { Gender } from 'src/types/constants';
import { RegisterInputs } from 'src/types/forms.type';

type GenderButtonsProps = {
  genders: Gender[];
  register: UseFormRegister<RegisterInputs>;
}

const GenderValueType = {
  Male: 'Мужской',
  Female: 'Женский',
  NoMatter: 'Неважно'
};

export default function GenderButtons({genders, register}: GenderButtonsProps): JSX.Element {
  return (
    <div className="sign-up__radio">
      <span className="sign-up__label">Пол</span>
      <div className="custom-toggle-radio custom-toggle-radio--big">
        {genders.map((gender) => (
          <label key={gender}>
            <input type="radio" value={gender} {...register('gender')} />
            <span className="custom-toggle-radio__icon"></span>
            <span className="custom-toggle-radio__label">{GenderValueType[gender]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
