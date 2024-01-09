import { render, screen, waitFor } from '@testing-library/react';
import MyTrainingsFilterDesk from './my-trainings-filter-desk';
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
import { MockTrainer, MockTrainerProfile } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import { getMyTrainingsAction } from 'src/store/api-actions';
import MockAdapter from 'axios-mock-adapter';
import { setMyTrainingsFiltersStateAction } from 'src/store/main-process/main-process.reducer';
import { Route, Routes } from 'react-router-dom';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();
describe('Component: MyTrainingsFilterDesk', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: []
      },
      [SliceNameSpace.Main]: {
        myTrainingsFilterState: {}
      }
    };

    store = mockStore(initialState);

    mockAPI
      .onGet(ApiRoute.MyTrainings)
      .reply(200, {trainingList: [], totalTrainingCount: 0});
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyTrainingsFilterDesk />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText('фильтры')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Назад'})).toBeInTheDocument();
    expect(screen.getByText('Цена, ₽')).toBeInTheDocument();
    expect(screen.getByText('Калории')).toBeInTheDocument();
    expect(screen.getByText('Рейтинг')).toBeInTheDocument();
    expect(screen.getByText('Длительность')).toBeInTheDocument();
  });

  it('should dispatch getMyTrainingsAction if user clicks on one of checkboxes', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyTrainingsFilterDesk />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const checkBoxes = await screen.findAllByRole<HTMLInputElement>('checkbox');
    await user.click(checkBoxes[0]);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions).toEqual([
        //initial useEffect dispatch
        getMyTrainingsAction.pending.type,
        getMyTrainingsAction.fulfilled.type,
        setMyTrainingsFiltersStateAction.type,

        //user dispatch
        getMyTrainingsAction.pending.type,
        getMyTrainingsAction.fulfilled.type,
        setMyTrainingsFiltersStateAction.type,
      ]);
    }, {timeout: 1500});

  });

  it('should dispatch getMyTrainingsAction if user type some value in price input', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyTrainingsFilterDesk />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const maxPriceField = await screen.findByTestId<HTMLInputElement>('max-price-field');
    await user.type(maxPriceField, '1500');

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions).toEqual([
        //initial useEffect dispatch
        getMyTrainingsAction.pending.type,
        getMyTrainingsAction.fulfilled.type,
        setMyTrainingsFiltersStateAction.type,

        //user dispatch
        getMyTrainingsAction.pending.type,
        getMyTrainingsAction.fulfilled.type,
        setMyTrainingsFiltersStateAction.type,
      ]);
    }, {timeout: 1500});

  });

  it('should navigate to coach account page if user clicks on navigate button', async () => {
    const user = userEvent.setup();
    history.push('/my_trainings');

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={AppRoute.CoachAccount}
                element={<h1>Coach account page</h1>}
              />
              <Route
                path='/my_trainings'
                element={<MyTrainingsFilterDesk />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Coach account page/i)).not.toBeInTheDocument();
    const navigateBtn = await screen.findByRole('button', {name: 'Назад'});
    await user.click(navigateBtn);
    expect(await screen.findByText(/Coach account page/i)).toBeInTheDocument();
    expect(navigateBtn).not.toBeInTheDocument();
  });
});
