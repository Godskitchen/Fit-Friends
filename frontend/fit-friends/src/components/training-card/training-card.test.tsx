import { render, screen } from '@testing-library/react';
import { createTrainingMocks } from 'src/mock-constants';
import HistoryRouter from '../history-router/history-router';
import { createBrowserHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import TrainingCard from './training-card';

const [mockTraining] = createTrainingMocks(1);
const history = createBrowserHistory();
describe('Component:TrainingCard', () => {
  it('should render correctly', () => {

    render(
      <HistoryRouter history={history}>
        <TrainingCard
          card={mockTraining}
          className='user-card-coach__training-item'
        />
      </HistoryRouter>
    );

    expect(screen.getByText(mockTraining.price)).toBeInTheDocument();
    expect(screen.getByText(mockTraining.title)).toBeInTheDocument();
    expect(screen.getByText(`#${mockTraining.caloriesToBurn}ккал`)).toBeInTheDocument();
    expect(screen.getByText(mockTraining.description)).toBeInTheDocument();
    expect(screen.getByText(/Подробнее/i)).toBeInTheDocument();
  });

  it('should navigate to training details page if user clicks on "details" button', async () => {
    const user = userEvent.setup();
    history.push('/card');

    render(
      <HistoryRouter history={history}>
        <Routes>
          <Route
            path={`${AppRoute.TrainingsCatalog}/${mockTraining.trainingId}`}
            element={<h1>Training info page</h1>}
          />
          <Route
            path='/card'
            element={
              <TrainingCard
                card={mockTraining}
                className='user-card-coach__training-item'
              />
            }
          />
        </Routes>
      </HistoryRouter>
    );

    expect(screen.queryByText(/Training info page/i)).not.toBeInTheDocument();
    const navigateBtn = await screen.findByText('Подробнее');
    await user.click(navigateBtn);
    expect(await screen.findByText(/Training info page/i)).toBeInTheDocument();
  });
});
