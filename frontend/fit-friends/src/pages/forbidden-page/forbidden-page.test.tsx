import { configureMockStore } from '@jedmao/redux-mock-store';
import { createBrowserHistory } from 'history';
import HistoryRouter from 'src/components/history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AppRoute } from 'src/app-constants';
import { Route, Routes } from 'react-router-dom';
import ForbiddenPage from './forbidden-page';

const mockStore = configureMockStore();
const history = createBrowserHistory();

describe('Page: ForbiddenPage', () => {

  it('should render correctly', () => {

    render(
      <Provider store={mockStore({})}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <ForbiddenPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText('Данная страница для вас недоступна')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('На главную');
  });

  it('should navigate to main page correctly by clicking on button', () => {
    history.push('/forbidden');

    render(
      <Provider store={mockStore({})}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={AppRoute.Main}
                element={<h1>Main Page</h1>}
              />
              <Route
                path={AppRoute.Forbidden}
                element={<ForbiddenPage />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Main Page/i)).not.toBeInTheDocument();

    const backToMainBtn = screen.getByRole('button');
    fireEvent.click(backToMainBtn);

    expect(screen.getByText(/Main Page/i)).toBeInTheDocument();
  });
});
