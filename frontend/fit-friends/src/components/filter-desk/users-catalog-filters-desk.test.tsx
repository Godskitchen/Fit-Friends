import { render, screen, waitFor } from '@testing-library/react';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { createAPI } from 'src/services/server-api';
import { Provider } from 'react-redux';
import HistoryRouter from '../history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import { ApiRoute, AppRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MockUser, MockUserProfile } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import { getUsersListAction } from 'src/store/api-actions';
import MockAdapter from 'axios-mock-adapter';
import { setUsersCatalogFilterStateAction } from 'src/store/main-process/main-process.reducer';
import { Route, Routes } from 'react-router-dom';
import UsersCatalogFiltersDesk from './users-catalog-filters-desk';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();
describe('Component: UsersCatalogFilterDesk', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: []
      },
      [SliceNameSpace.Main]: {
        usersCatalogFilterState: {}
      }
    };

    store = mockStore(initialState);

    mockAPI
      .onGet(ApiRoute.UsersList)
      .reply(200, {userList: [], totalUserList: 0});
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <UsersCatalogFiltersDesk />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText('Фильтры')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Назад'})).toBeInTheDocument();
    expect(screen.getByText('Локация, станция метро')).toBeInTheDocument();
    expect(screen.getByText('Специализация')).toBeInTheDocument();
  });

  it('should dispatch getTrainingListAction if user clicks on one of gender buttons', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <UsersCatalogFiltersDesk />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const radioBtn = await screen.findByTestId<HTMLInputElement>('Pro');
    await user.click(radioBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions).toEqual([
        //initial useEffect dispatch
        getUsersListAction.pending.type,
        getUsersListAction.fulfilled.type,
        setUsersCatalogFilterStateAction.type,

        //user dispatch
        getUsersListAction.pending.type,
        getUsersListAction.fulfilled.type,
        setUsersCatalogFilterStateAction.type,
      ]);
    }, {timeout: 1500});

  });

  it('should dispatch getTrainingListAction if user drags rating value slider', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <UsersCatalogFiltersDesk />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const sortBtn = await screen.findByTestId<HTMLInputElement>('Trainer');
    await user.click(sortBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions).toEqual([
        //initial useEffect dispatch
        getUsersListAction.pending.type,
        getUsersListAction.fulfilled.type,
        setUsersCatalogFilterStateAction.type,

        //user dispatch
        getUsersListAction.pending.type,
        getUsersListAction.fulfilled.type,
        setUsersCatalogFilterStateAction.type,
      ]);
    }, {timeout: 1500});


  });

  it('should navigate to main page if user clicks on navigate button', async () => {
    const user = userEvent.setup();
    history.push('/users_catalog');

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
                path='/users_catalog'
                element={<UsersCatalogFiltersDesk />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Main page/i)).not.toBeInTheDocument();
    const navigateBtn = await screen.findByRole('button', {name: 'Назад'});
    await user.click(navigateBtn);
    expect(await screen.findByText(/Main page/i)).toBeInTheDocument();
    expect(navigateBtn).not.toBeInTheDocument();
  });
});
