import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { SliceNameSpace, AuthorizationStatus, AppRoute } from 'src/app-constants';
import HistoryRouter from 'src/components/history-router/history-router';
import { MockTrainer, MockTrainerProfile } from 'src/mock-constants';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { Route, Routes } from 'react-router-dom';
import PersonalAccountCoachPage from './personal-account-coach.page';


jest.mock('src/utils/pdf-thumbnailer', () => (_cert: string) => 'http://localhost:4000/static/users/backs/user-3.png');
jest.mock('nanoid', () => ({
  customAlphabet: (_alphabet: string, _defaultSize?: number) => {
    let idCounter = 1;
    return () => idCounter++;
  }})
);

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Page: PersonalCoachAccountPage', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
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
            <PersonalAccountCoachPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    //header
    expect(screen.getByTestId('profile')).not.toHaveClass('is-active');
    expect(screen.getByTestId('main')).toHaveClass('is-active');
    expect(screen.getByTestId('friends')).not.toHaveClass('is-active');

    expect(screen.getByText(/Личный кабинет/i)).toBeInTheDocument();
    expect(screen.getByText(/Обо мне/i)).toBeInTheDocument();
    expect(screen.getByText(/Мои тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Создать тренировку/i)).toBeInTheDocument();
    expect(screen.getByText(/Мои друзья/i)).toBeInTheDocument();
    expect(screen.getByText(/Мои заказы/i)).toBeInTheDocument();
    expect(screen.getByText(/Дипломы и сертификаты/i)).toBeInTheDocument();
  });

  it('should navigate to my_friends page when user clicks on "my_friends" button', () => {

    history.push(AppRoute.CoachAccount);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={`${AppRoute.CoachAccount}${AppRoute.MyFriends}`}
                element={<h1>My friends page</h1>}
              />
              <Route
                path={AppRoute.CoachAccount}
                element={<PersonalAccountCoachPage />}
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

  it('should navigate to my_orders page when user clicks on "my_orders" button', () => {

    history.push(AppRoute.CoachAccount);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={`${AppRoute.CoachAccount}${AppRoute.MyOrders}`}
                element={<h1>My orders page</h1>}
              />
              <Route
                path={AppRoute.CoachAccount}
                element={<PersonalAccountCoachPage />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Личный кабинет/i)).toBeInTheDocument();
    expect(screen.queryByText(/My orders page/i)).not.toBeInTheDocument();

    const myOrdersBtn = screen.getByText(/Мои заказы/i);
    fireEvent.click(myOrdersBtn);
    expect(screen.getByText(/My orders page/i)).toBeInTheDocument();
  });

  it('should navigate to my_trainings page when user clicks on "my_trainings" button', () => {

    history.push(AppRoute.CoachAccount);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={`${AppRoute.CoachAccount}${AppRoute.MyTrainings}`}
                element={<h1>My trainings page</h1>}
              />
              <Route
                path={AppRoute.CoachAccount}
                element={<PersonalAccountCoachPage />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Личный кабинет/i)).toBeInTheDocument();
    expect(screen.queryByText(/My trainings page/i)).not.toBeInTheDocument();

    const myTrainingsBtn = screen.getByText(/Мои тренировки/i);
    fireEvent.click(myTrainingsBtn);
    expect(screen.getByText(/My trainings page/i)).toBeInTheDocument();
  });

  it('should navigate to create_training page when user clicks on "create_training" button', () => {

    history.push(AppRoute.CoachAccount);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={`${AppRoute.CoachAccount}${AppRoute.CreateTraining}`}
                element={<h1>Create training page</h1>}
              />
              <Route
                path={AppRoute.CoachAccount}
                element={<PersonalAccountCoachPage />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Личный кабинет/i)).toBeInTheDocument();
    expect(screen.queryByText(/Create training page/i)).not.toBeInTheDocument();

    const createTrainingBtn = screen.getByText(/Создать тренировку/i);
    fireEvent.click(createTrainingBtn);
    expect(screen.getByText(/Create training page/i)).toBeInTheDocument();
  });
});
