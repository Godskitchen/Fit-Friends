import { UseFormRegister, UseFormTrigger } from 'react-hook-form';
import { Specialisation } from 'src/types/constants';
import { ProfileInfoInputs } from 'src/types/forms.type';
import { TRAINING_TYPE_COUNT } from 'src/utils/validators/constants';
import { specialisationValidationHandler } from 'src/utils/validators/specialisation';

type SpecialisationListProps = {
  types: Specialisation[];
  register: UseFormRegister<ProfileInfoInputs>;
  trigger: UseFormTrigger<ProfileInfoInputs>;
  isEditMode: boolean;
  selectedSpecs: Specialisation[];
}

const TypeButtonValue = {
  Yoga: 'Йога',
  Running: 'Бег',
  Power: 'Силовые',
  Aerobics: 'Аэробика',
  Crossfit: 'Кроссфит',
  Boxing: 'Бокс',
  Pilates: 'Пилатес',
  Stretching: 'Стрейчинг'
};

export default function ProfileSpecialisationList({types, register, trigger, isEditMode, selectedSpecs}: SpecialisationListProps): JSX.Element[] {

  const handleCheckboxChange = (value: Specialisation) => {
    if (selectedSpecs.includes(value)) {
      selectedSpecs.splice(selectedSpecs.indexOf(value), 1);
    } else {
      selectedSpecs.push(value);
    }
    setTimeout(() => {trigger('specialisations');}, 100);
  };

  return (
    types.map((type) => (
      <div className="btn-checkbox" key={type}>
        <label>
          <input
            className="visually-hidden"
            type="checkbox"
            value={type}
            {...register('specialisations',
              {
                validate: () => specialisationValidationHandler(selectedSpecs),
                onChange: () => handleCheckboxChange(type),
                disabled: !isEditMode || (selectedSpecs.length >= TRAINING_TYPE_COUNT.MAX && !selectedSpecs.includes(type)),
              })
            }
          />
          <span className="btn-checkbox__btn">{TypeButtonValue[type]}</span>
        </label>
      </div>
    ))
  );
}
