import { render, screen } from '@testing-library/react';
import ErrorScreen from './error-screen';

describe('Component: ErrorScreen', () => {
  it('should render correctly', () => {

    render(<ErrorScreen/>);

    expect(screen.getByAltText(/Фон с бегущей девушкой/i)).toBeInTheDocument();
    expect(screen.getByText(/Приложение временно недоступно. Приносим извинения/i)).toBeInTheDocument();
  });
});
