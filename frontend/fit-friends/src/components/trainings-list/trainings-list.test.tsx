import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createTrainingMocks } from 'src/mock-constants';
import TrainingsList from './trainings-list';

describe('Component: TrainingList', () => {
  it('should render correctly', () => {

    render(
      <MemoryRouter>
        <TrainingsList
          trainingCards={createTrainingMocks(6)}
          listClassName='my-purchases__list'
          itemClassName='my-purchases__item'
        />
      </MemoryRouter>
    );

    expect(screen.getAllByTestId('training-card')).toHaveLength(6);
  });
});
