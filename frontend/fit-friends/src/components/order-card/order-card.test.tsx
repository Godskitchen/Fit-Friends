import { render, screen } from '@testing-library/react';
import OrderCard from './order-card';
import { createOrderMocks } from 'src/mock-constants';
import HistoryRouter from '../history-router/history-router';
import { BrowserHistory, createBrowserHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';

const [mockCard] = createOrderMocks(1);

describe('Component: OrderCard', () => {
  let history: BrowserHistory;
  beforeEach(() => {
    history = createBrowserHistory();
  });
  it('should render correctly', () => {

    render(
      <HistoryRouter history={history}>
        <OrderCard {...mockCard} />
      </HistoryRouter>
    );

    expect(screen.getByTestId('order-card')).toBeInTheDocument();
    expect(screen.getByText(`#${mockCard.training.caloriesToBurn}ккал`)).toBeInTheDocument();
    expect(screen.getByText(`${mockCard.training.description}`)).toBeInTheDocument();
    expect(screen.getByText(/Подробнее/i)).toBeInTheDocument();
    expect(screen.getByText(/Общая сумма/i)).toBeInTheDocument();
    expect(screen.getByText(/Куплено тренировок/i)).toBeInTheDocument();
  });

  it('should navigate to training details if user clicks on "details" button', async () => {
    const user = userEvent.setup();
    history.push('/card');

    render(
      <HistoryRouter history={history}>
        <Routes>
          <Route
            path={`${AppRoute.TrainingsCatalog}/${mockCard.training.trainingId}`}
            element={<h1>Training page</h1>}
          />
          <Route
            path='/card'
            element={<OrderCard {...mockCard} />}
          />
        </Routes>
      </HistoryRouter>
    );

    expect(await screen.findByTestId('order-card')).toBeInTheDocument();
    expect(screen.queryByText(/Training page/i)).not.toBeInTheDocument();
    const detailsBtn = await screen.findByText(/Подробнее/i);

    await user.click(detailsBtn);

    expect(await screen.findByText(/Training page/i)).toBeInTheDocument();
    expect(screen.queryByTestId('order-card')).not.toBeInTheDocument();
  });
});
