import { render, screen } from '@testing-library/react';
import { createUserMocks } from 'src/mock-constants';
import HistoryRouter from '../history-router/history-router';
import { createBrowserHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import UserSmallCard from './user-small-card';

const [mockUser] = createUserMocks(1);
const history = createBrowserHistory();
describe('Component:UserSmallCard', () => {
  it('should render correctly', () => {

    render(
      <HistoryRouter history={history}>
        <UserSmallCard card={mockUser} />
      </HistoryRouter>
    );

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.location)).toBeInTheDocument();
    expect(screen.getByText(/Подробнее/i)).toBeInTheDocument();
  });

  it('should navigate to user details page if user clicks on "details" button', async () => {
    const user = userEvent.setup();
    history.push('/card');

    render(
      <HistoryRouter history={history}>
        <Routes>
          <Route
            path={`${AppRoute.UsersCatalog}/${mockUser.userId}`}
            element={<h1>User info page</h1>}
          />
          <Route
            path='/card'
            element={<UserSmallCard card={mockUser} />}
          />
        </Routes>
      </HistoryRouter>
    );

    expect(screen.queryByText(/User info page/i)).not.toBeInTheDocument();
    const navigateBtn = await screen.findByText('Подробнее');
    await user.click(navigateBtn);
    expect(await screen.findByText(/User info page/i)).toBeInTheDocument();
  });
});
