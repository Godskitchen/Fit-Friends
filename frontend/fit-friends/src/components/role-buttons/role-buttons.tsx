import { UseFormRegister } from 'react-hook-form';
import { Role } from 'src/types/constants';
import { RegisterInputs } from 'src/types/forms.type';

type RoleButtonsProps = {
  roles: Role[];
  register: UseFormRegister<RegisterInputs>;
}

const ButtonText = {
  Coach: 'Я хочу тренировать',
  Sportsman: 'Я хочу тренироваться'
};

export default function RoleButtons({roles, register}: RoleButtonsProps): JSX.Element {
  return (
    <div className="sign-up__role">
      <h2 className="sign-up__legend">Выберите роль</h2>
      <div className="role-selector sign-up__role-selector">
        {roles.map((role) => (
          <div key={role} className="role-btn">
            <label>
              <input className="visually-hidden" type="radio" value={role} {...register('role')} />
              <span className="role-btn__icon">
                <svg width="12" height="13" aria-hidden="true">
                  <use xlinkHref="#icon-cup"></use>
                </svg>
              </span>
              <span className="role-btn__btn">{ButtonText[role]}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
