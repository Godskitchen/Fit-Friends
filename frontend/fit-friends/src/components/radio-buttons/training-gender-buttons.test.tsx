import { render, screen } from '@testing-library/react';
import { TrainingGenderFieldValue } from 'src/types/constants';
import TrainingGenderButtons from './training-gender-buttons';

describe('Component: TrainingGenderButtons', () => {
  it('should render correctly', () => {

    render(<TrainingGenderButtons register={jest.fn()}/>);

    expect(screen.getByText('Кому подойдет тренировка')).toBeInTheDocument();
    expect(screen.getByText(TrainingGenderFieldValue.Female)).toBeInTheDocument();
    expect(screen.getByText(TrainingGenderFieldValue.Male)).toBeInTheDocument();
    expect(screen.getByText(TrainingGenderFieldValue.NoMatter)).toBeInTheDocument();
  });
});
