import { render, screen } from '@testing-library/react';
import GenderButtons from './gender-buttons';
import { GenderFieldValue } from 'src/types/constants';

describe('Component: GenderButtons', () => {
  it('should render correctly', () => {

    render(<GenderButtons register={jest.fn()}/>);

    expect(screen.getByText('Пол')).toBeInTheDocument();
    expect(screen.getByText(GenderFieldValue.Female)).toBeInTheDocument();
    expect(screen.getByText(GenderFieldValue.Male)).toBeInTheDocument();
    expect(screen.getByText(GenderFieldValue.NoMatter)).toBeInTheDocument();
  });
});
