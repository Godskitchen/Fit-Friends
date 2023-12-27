/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureMockStore } from '@jedmao/redux-mock-store';
import { createBrowserHistory } from 'history';
import HistoryRouter from 'src/components/history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AppRoute } from 'src/app-constants';
import { Route, Routes } from 'react-router-dom';
import WelcomePage from './welcome.page';

const mockStore = configureMockStore();
const history = createBrowserHistory();

describe('Page: WelcomePage', () => {

  it('should render correctly', () => {

    render(
      <Provider store={mockStore({})}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <WelcomePage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('intro-background')).toBeInTheDocument();
    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Регистрация');
  });

  it('should navigate to registration page correctly by clicking on register button', () => {
    history.push('/');

    render(
      <Provider store={mockStore({})}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={AppRoute.Registration}
                element={<h1>Registration Page</h1>}
              />
              <Route
                path={AppRoute.Welcome}
                element={<WelcomePage />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Registration Page/i)).not.toBeInTheDocument();

    const registerBtn = screen.getByRole('button');
    fireEvent.click(registerBtn);

    expect(screen.getByText(/Registration Page/i)).toBeInTheDocument();
  });

  it('should navigate to login page correctly by clicking on login navigation link', () => {
    history.push('/');

    render(
      <Provider store={mockStore({})}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={AppRoute.Login}
                element={<h1>Login Page</h1>}
              />
              <Route
                path={AppRoute.Welcome}
                element={<WelcomePage />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Login Page/i)).not.toBeInTheDocument();

    const loginBtn = screen.getByText('Вход');
    fireEvent.click(loginBtn);

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });
});
