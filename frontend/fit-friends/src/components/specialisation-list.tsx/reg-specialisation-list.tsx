import { Fragment } from 'react';
import { UseFormRegister, UseFormTrigger, FieldPath, FieldValues} from 'react-hook-form';
import { Specialisation, SpecialisationFieldValue } from 'src/types/constants';
import { specialisationValidationHandler } from 'src/utils/validators/user/specialisation';

type SpecialisationFieldPath<T extends FieldValues> = {
  specialisations: FieldPath<T>;
}

type SpecialisationListProps<T extends FieldValues> = {
  types: Specialisation[];
  register: UseFormRegister<T>;
  trigger: UseFormTrigger<T>;
  fieldPaths: SpecialisationFieldPath<T>;
  selectedSpecs: Specialisation[];
}

export default function RegSpecialisationList<T extends FieldValues>({types, register, trigger, fieldPaths, selectedSpecs}: SpecialisationListProps<T>): JSX.Element {

  const handleCheckboxChange = (value: Specialisation) => {
    if (selectedSpecs.includes(value)) {
      selectedSpecs.splice(selectedSpecs.indexOf(value), 1);
    } else {
      selectedSpecs.push(value);
    }
    setTimeout(() => {trigger(fieldPaths.specialisations);}, 100);
  };

  return (
    <Fragment>
      <span className="questionnaire-coach__legend">Ваша специализация (тип) тренировок</span>
      <div className="specialization-checkbox questionnaire-coach__specializations">
        {
          types.map((type) => (
            <div className="btn-checkbox" key={type}>
              <label>
                <input
                  className="visually-hidden"
                  type="checkbox"
                  value={type}
                  data-testid="specialisations"
                  {...register(fieldPaths.specialisations,
                    {
                      validate: () => specialisationValidationHandler(selectedSpecs),
                      onChange: () => handleCheckboxChange(type),
                    })
                  }
                />
                <span className="btn-checkbox__btn">{SpecialisationFieldValue[type]}</span>
              </label>
            </div>
          ))
        }
      </div>
    </Fragment>
  );
}
