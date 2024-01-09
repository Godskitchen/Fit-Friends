import { render, screen } from '@testing-library/react';
import { Specialisation, SpecialisationFieldValue } from 'src/types/constants';
import ProfileSpecialisationList from './profile-specialisation-list';

describe('Component: ProfileSpecialisationList', () => {
  it('should render correctly', () => {

    render(
      <ProfileSpecialisationList
        register={jest.fn()}
        trigger={jest.fn()}
        isEditMode={false}
        selectedSpecs={[Specialisation.Aerobics]}
        types={Object.values(Specialisation)}
      />
    );

    expect(screen.getByText('Специализация')).toBeInTheDocument();
    Object.values(SpecialisationFieldValue).forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });
});
