import { render, screen } from '@testing-library/react';
import { createUserMocks } from 'src/mock-constants';
import HistoryRouter from '../history-router/history-router';
import { createBrowserHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import UserCard from './user-card';
import { Specialisation, SpecialisationHashTagValue } from 'src/types/constants';

const [mockUser] = createUserMocks(1);
const history = createBrowserHistory();
describe('Component:UserCard', () => {
  it('should render correctly', () => {

    render(
      <HistoryRouter history={history}>
        <UserCard
          userId={mockUser.userId}
          name={mockUser.name}
          avatar={mockUser.avatar}
          location={mockUser.location}
          role={mockUser.role}
          specialisations={[Specialisation.Aerobics, Specialisation.Boxing]}
        />
      </HistoryRouter>
    );

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.location)).toBeInTheDocument();
    expect(screen.getByText(SpecialisationHashTagValue.Aerobics)).toBeInTheDocument();
    expect(screen.getByText(SpecialisationHashTagValue.Boxing)).toBeInTheDocument();
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
            element={
              <UserCard
                userId={mockUser.userId}
                name={mockUser.name}
                avatar={mockUser.avatar}
                location={mockUser.location}
                role={mockUser.role}
                specialisations={[Specialisation.Aerobics, Specialisation.Boxing]}
              />
            }
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
