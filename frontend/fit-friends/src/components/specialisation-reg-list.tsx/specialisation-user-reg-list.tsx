import { Fragment } from 'react';
import { UseFormRegister, Control, UseFormTrigger, useWatch } from 'react-hook-form';
import { Specialisation } from 'src/types/constants';
import { QuestionnaireUserInputs } from 'src/types/forms.type';
import { TRAINING_TYPE_COUNT } from 'src/utils/validators/constants';
import { specialisationValidationHandler } from 'src/utils/validators/specialisation';


type SpecialisationListProps = {
  types: Specialisation[];
  register: UseFormRegister<QuestionnaireUserInputs>;
  control: Control<QuestionnaireUserInputs>;
  trigger: UseFormTrigger<QuestionnaireUserInputs>;
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

export default function SpecialisationUserRegList({types, register, control, trigger}: SpecialisationListProps): JSX.Element {

  const selectedSpecs = useWatch<QuestionnaireUserInputs, 'specialisations'>({control, name: 'specialisations'});
  const handleCheckboxChange = (value: Specialisation) => {
    if (selectedSpecs.includes(value)) {
      selectedSpecs.splice(selectedSpecs.indexOf(value), 1);
    } else {
      selectedSpecs.push(value);
    }
    setTimeout(() => {trigger('specialisations');}, 100);
  };

  return (
    <Fragment>
      <span className="questionnaire-coach__legend">Ваша специализация (тип) тренировок</span>
      <div className="specialization-checkbox questionnaire-coach__specializations">
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
                    disabled: selectedSpecs.length >= TRAINING_TYPE_COUNT.MAX && !selectedSpecs.includes(type),
                  })
                }
              />
              <span className="btn-checkbox__btn">{TypeButtonValue[type]}</span>
            </label>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
