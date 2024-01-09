import { render, screen} from '@testing-library/react';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { createAPI } from 'src/services/server-api';
import { Provider } from 'react-redux';
import HistoryRouter from '../history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MockUser, MockUserProfile } from 'src/mock-constants';
import { HeaderNavTab } from 'src/types/constants';
import Header from './header';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Component: Header', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: []
      },
    };

    store = mockStore(initialState);
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Header activeTab={HeaderNavTab.Home} />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('profile')).not.toHaveClass('is-active');
    expect(screen.getByTestId('main')).toHaveClass('is-active');
    expect(screen.getByTestId('friends')).not.toHaveClass('is-active');
    expect(screen.getByTestId('notifications')).not.toHaveClass('is-active');
  });

  it('should navigate to "my friends" page if user clicks on friends button', async () => {
    const user = userEvent.setup();
    history.push('/header');

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={`${AppRoute.UserAccount}${AppRoute.MyFriends}`}
                element={<h1>Friends page</h1>}
              />
              <Route
                path='/header'
                element={ <Header activeTab={HeaderNavTab.Home} />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Friends page/i)).not.toBeInTheDocument();
    const navigateBtn = await screen.findByTestId('friends');
    await user.click(navigateBtn);
    expect(await screen.findByText(/Friends page/i)).toBeInTheDocument();
  });

  it('should navigate to "user account" page if user clicks on profile button', async () => {
    const user = userEvent.setup();
    history.push('/header');

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={AppRoute.UserAccount}
                element={<h1>Account page</h1>}
              />
              <Route
                path='/header'
                element={ <Header activeTab={HeaderNavTab.Home} />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Account page/i)).not.toBeInTheDocument();
    const navigateBtn = await screen.findByTestId('profile');
    await user.click(navigateBtn);
    expect(await screen.findByText(/Account page/i)).toBeInTheDocument();
  });

  it('should navigate to main page if user clicks on home button', async () => {
    const user = userEvent.setup();
    history.push('/header');

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={AppRoute.Main}
                element={<h1>Main page</h1>}
              />
              <Route
                path='/header'
                element={ <Header activeTab={HeaderNavTab.Profile} />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Main page/i)).not.toBeInTheDocument();
    const navigateBtn = await screen.findByTestId('main');
    await user.click(navigateBtn);
    expect(await screen.findByText(/Main page/i)).toBeInTheDocument();
  });
});
