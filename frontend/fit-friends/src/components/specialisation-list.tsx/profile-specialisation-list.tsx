import { UseFormRegister, UseFormTrigger } from 'react-hook-form';
import { Specialisation, SpecialisationFieldValue } from 'src/types/constants';
import { ProfileInfoInputs } from 'src/types/forms.type';
import { specialisationValidationHandler } from 'src/utils/validators/user/specialisation';

type SpecialisationListProps = {
  types: Specialisation[];
  register: UseFormRegister<ProfileInfoInputs>;
  trigger: UseFormTrigger<ProfileInfoInputs>;
  isEditMode: boolean;
  selectedSpecs: Specialisation[];
}

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
                disabled: !isEditMode,
              })
            }
          />
          <span className="btn-checkbox__btn">{SpecialisationFieldValue[type]}</span>
        </label>
      </div>
    ))
  );
}
