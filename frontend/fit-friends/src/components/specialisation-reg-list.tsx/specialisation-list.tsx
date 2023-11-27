import { UseFormRegister, UseFormTrigger } from 'react-hook-form';
import { Specialisation } from 'src/types/constants';
import { CoachInfoInputs } from 'src/types/forms.type';
import { TRAINING_TYPE_COUNT } from 'src/utils/validators/constants';
import { specialisationValidationHandler } from 'src/utils/validators/specialisation';

type SpecialisationListProps = {
  types: Specialisation[];
  register: UseFormRegister<CoachInfoInputs>;
  trigger: UseFormTrigger<CoachInfoInputs>;
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

export default function SpecialisationList({types, register, trigger, isEditMode, selectedSpecs}: SpecialisationListProps): JSX.Element {

  const handleCheckboxChange = (value: Specialisation) => {
    if (selectedSpecs.includes(value)) {
      selectedSpecs.splice(selectedSpecs.indexOf(value), 1);
    } else {
      selectedSpecs.push(value);
    }
    setTimeout(() => {trigger('specialisations');}, 100);
  };

  return (
    <div className="user-info-edit__section">
      <h2 className="user-info-edit__title user-info-edit__title--specialization">Специализация</h2>
      <div className="specialization-checkbox user-info-edit__specialization">
        {types.map((type) => (
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
        ))}
      </div>
    </div>
  );
}
