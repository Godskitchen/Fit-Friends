import { render, screen } from '@testing-library/react';
import { Specialisation, SpecialisationFieldValue } from 'src/types/constants';
import RegSpecialisationList from './reg-specialisation-list';

describe('Component: ProfileSpecialisationList', () => {
  it('should render correctly', () => {

    render(
      <RegSpecialisationList
        register={jest.fn()}
        trigger={jest.fn()}
        selectedSpecs={[]}
        types={Object.values(Specialisation)}
        fieldPaths={{specialisations: 'specialisations'}}
      />
    );

    expect(screen.getByText('Ваша специализация (тип) тренировок')).toBeInTheDocument();
    Object.values(SpecialisationFieldValue).forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });
});
