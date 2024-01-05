import { render, screen } from '@testing-library/react';
import { createAPI } from 'src/services/server-api';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { AppRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { Provider } from 'react-redux';
import HistoryRouter from 'src/components/history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import userEvent from '@testing-library/user-event';
import { MockTrainer, MockTrainerProfile, MockUser, MockUserProfile } from 'src/mock-constants';
import Router from 'react-router';
import UserPage from './user.page';
import { Route, Routes } from 'react-router-dom';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
} as object));

const currentUserDetails = {...MockUser, userId: 2, userProfile: MockUserProfile};
const mockId = currentUserDetails.userId;

let history = createBrowserHistory();

describe('Page: UserPage', () => {

  let store: ReturnType<typeof mockStore>;
  let initialState;

  it('should render correctly', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ userId: `${mockId}` });

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        currentUserDetails
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile},
        notifications: [],
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <UserPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(await screen.findByRole('button', {name: 'Назад'})).toBeInTheDocument();
    expect(await screen.findByText(/Карточка пользователя/i)).toBeInTheDocument();
  });


  it('should navigate to Users Catalog Page, if user with role=User watches page and clicks to navigate btn.', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ userId: `${mockId}` });

    history = createBrowserHistory();
    history.push('/user_page');

    const user = userEvent.setup();

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        currentUserDetails
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile},
        notifications: [],
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={AppRoute.UsersCatalog}
                element={<h1>Users Catalog Page</h1>}
              />
              <Route
                path={'/user_page'}
                element={<UserPage />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const navigateBtn = await screen.findByRole('button', {name: 'Назад'});
    expect(navigateBtn).toBeInTheDocument();
    expect(screen.queryByText(/Users Catalog Page/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/Карточка пользователя/i)).toBeInTheDocument();
    await user.click(navigateBtn);
    expect(await screen.findByText(/Users Catalog Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Карточка пользователя/i)).not.toBeInTheDocument();
  });

  it('should navigate to MyFriends Page, if user with role=Coach watches page and clicks to navigate btn.', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ userId: `${mockId}` });
    history = createBrowserHistory();
    history.push('/user_page');

    const user = userEvent.setup();

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        currentUserDetails
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile},
        notifications: [],
        friendList: [],
        totalFriendsCount: 0
      },
      [SliceNameSpace.Main]: {
        friendsQueryState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={`${AppRoute.CoachAccount}${AppRoute.MyFriends}`}
                element={<h1>My Friends Page</h1>}
              />
              <Route
                path={'/user_page'}
                element={<UserPage />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const navigateBtn = await screen.findByRole('button', {name: 'Назад'});
    expect(navigateBtn).toBeInTheDocument();
    expect(screen.queryByText(/My Friends Page/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/Карточка пользователя/i)).toBeInTheDocument();
    await user.click(navigateBtn);
    expect(await screen.findByText(/My Friends Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Карточка пользователя/i)).not.toBeInTheDocument();
  });
});
