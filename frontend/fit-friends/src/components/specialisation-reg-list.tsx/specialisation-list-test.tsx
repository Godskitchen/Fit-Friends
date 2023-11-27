import { UseFormRegister, UseFormTrigger, FieldPath, FieldValues} from 'react-hook-form';
import { Specialisation } from 'src/types/constants';
import { TRAINING_TYPE_COUNT } from 'src/utils/validators/constants';
import { specialisationValidationHandler } from 'src/utils/validators/specialisation';

type SkillLeveFieldPath<T extends FieldValues> = {
  specialisations: FieldPath<T>;
}

type SpecialisationListProps<T extends FieldValues> = {
  types: Specialisation[];
  register: UseFormRegister<T>;
  trigger: UseFormTrigger<T>;
  fieldPaths: SkillLeveFieldPath<T>;
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

export default function SpecialisationListTest<T extends FieldValues>({types, register, trigger, fieldPaths, selectedSpecs}: SpecialisationListProps<T>): JSX.Element[] {

  const handleCheckboxChange = (value: Specialisation) => {
    if (selectedSpecs.includes(value)) {
      selectedSpecs.splice(selectedSpecs.indexOf(value), 1);
    } else {
      selectedSpecs.push(value);
    }
    setTimeout(() => {trigger(fieldPaths.specialisations);}, 100);
  };

  return (
    types.map((type) => (
      <div className="btn-checkbox" key={type}>
        <label>
          <input
            className="visually-hidden"
            type="checkbox"
            value={type}
            {...register(fieldPaths.specialisations,
              {
                validate: () => specialisationValidationHandler(selectedSpecs),
                onChange: () => handleCheckboxChange(type),
                disabled: selectedSpecs.length >= TRAINING_TYPE_COUNT.MAX && !selectedSpecs.includes(type),
              })
            }
          />
          <span className="btn-checkbox__btn">{TypeButtonValue[type]}</span>
        </label>
      </div>
    ))
  );
}
