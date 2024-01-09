import { render, screen } from '@testing-library/react';
import SpecialTrainingCard from './special-training-card';
import { createTrainingMocks } from 'src/mock-constants';
import HistoryRouter from '../history-router/history-router';
import { createBrowserHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';

const [mockTraining] = createTrainingMocks(1);
const history = createBrowserHistory();
describe('Component: SpecialTrainingCard', () => {
  it('should render correctly', () => {

    render(
      <HistoryRouter history={history}>
        <SpecialTrainingCard
          backgroundImage={mockTraining.backgroundImage}
          title={mockTraining.title}
          trainingId={mockTraining.trainingId}
        />
      </HistoryRouter>

    );

    expect(screen.getByAltText('training')).toBeInTheDocument();
    expect(screen.getByText(mockTraining.title)).toBeInTheDocument();
    expect(screen.getByText('Подробнее')).toBeInTheDocument();
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
              <SpecialTrainingCard
                backgroundImage={mockTraining.backgroundImage}
                title={mockTraining.title}
                trainingId={mockTraining.trainingId}
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
