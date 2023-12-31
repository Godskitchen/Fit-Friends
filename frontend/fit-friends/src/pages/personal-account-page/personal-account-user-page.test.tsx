import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import PersonalAccountUserPage from './personal-account-user.page';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { SliceNameSpace, AuthorizationStatus, AppRoute } from 'src/app-constants';
import HistoryRouter from 'src/components/history-router/history-router';
import { MockUser, MockUserProfile } from 'src/mock-constants';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { Route, Routes } from 'react-router-dom';


const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Page: PersonalUserAccountPage', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: []
      }
    };

    store = mockStore(initialState);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <PersonalAccountUserPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    //header
    expect(screen.getByTestId('profile')).toHaveClass('is-active');
    expect(screen.getByTestId('main')).not.toHaveClass('is-active');
    expect(screen.getByTestId('friends')).not.toHaveClass('is-active');

    expect(screen.getByText(/Личный кабинет/i)).toBeInTheDocument();
    expect(screen.getByText(/Обо мне/i)).toBeInTheDocument();
    expect(screen.getByText(/План на день, ккал/i)).toBeInTheDocument();
    expect(screen.getByText(/План на неделю, ккал/i)).toBeInTheDocument();
    expect(screen.getByText(/Мои друзья/i)).toBeInTheDocument();
    expect(screen.getByText(/Мои покупки/i)).toBeInTheDocument();
  });

  it('should navigate to my_friends page when user clicks on "my_friends" button', () => {

    history.push(AppRoute.UserAccount);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={`${AppRoute.UserAccount}${AppRoute.MyFriends}`}
                element={<h1>My friends page</h1>}
              />
              <Route
                path={AppRoute.UserAccount}
                element={<PersonalAccountUserPage />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Личный кабинет/i)).toBeInTheDocument();
    expect(screen.queryByText(/My friends page/i)).not.toBeInTheDocument();

    const myFriendsBtn = screen.getByText(/Мои друзья/i);
    fireEvent.click(myFriendsBtn);
    expect(screen.getByText(/My friends page/i)).toBeInTheDocument();

  });

  it('should navigate to my_purchases page when user clicks on "my_purchases" button', () => {

    history.push(AppRoute.UserAccount);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={`${AppRoute.UserAccount}${AppRoute.MyPurchases}`}
                element={<h1>My purchases page</h1>}
              />
              <Route
                path={AppRoute.UserAccount}
                element={<PersonalAccountUserPage />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Личный кабинет/i)).toBeInTheDocument();
    expect(screen.queryByText(/My purchases page/i)).not.toBeInTheDocument();

    const myPurchasesBtn = screen.getByText(/Мои покупки/i);
    fireEvent.click(myPurchasesBtn);
    expect(screen.getByText(/My purchases page/i)).toBeInTheDocument();
  });
});
