import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
import { getTrainingListAction } from 'src/store/api-actions';
import MockAdapter from 'axios-mock-adapter';
import { setTrainingCatalogFilterStateAction } from 'src/store/main-process/main-process.reducer';
import { Route, Routes } from 'react-router-dom';
import TrainingsCatalogFiltersDesk from './trainings-catalog-filter-desk';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();
describe('Component: TrainingsCatalogFilterDesk', () => {
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
        trainingsCatalogFilterState: {}
      }
    };

    store = mockStore(initialState);

    mockAPI
      .onGet(ApiRoute.TrainingList)
      .reply(200, {trainingList: [], totalTrainingCount: 0});
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingsCatalogFiltersDesk />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText('Фильтры')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Назад'})).toBeInTheDocument();
    expect(screen.getByText('Цена, ₽')).toBeInTheDocument();
    expect(screen.getByText('Калории')).toBeInTheDocument();
    expect(screen.getByText('Рейтинг')).toBeInTheDocument();
    expect(screen.getByText('Тип')).toBeInTheDocument();
  });

  it('should dispatch getTrainingListAction if user clicks on one of checkboxes', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingsCatalogFiltersDesk />
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
        getTrainingListAction.pending.type,
        getTrainingListAction.fulfilled.type,
        setTrainingCatalogFilterStateAction.type,

        //user dispatch
        getTrainingListAction.pending.type,
        getTrainingListAction.fulfilled.type,
        setTrainingCatalogFilterStateAction.type,
      ]);
    }, {timeout: 1500});

  });

  it('should dispatch getTrainingListAction if user drags rating value slider', async () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingsCatalogFiltersDesk />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const minValue = await screen.findByTestId<HTMLInputElement>('min-value');
    fireEvent.mouseDown(minValue);
    fireEvent.mouseMove(minValue, { clientX: 100, clientY: 0 });
    fireEvent.mouseUp(minValue);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions).toEqual([
        //initial useEffect dispatch
        getTrainingListAction.pending.type,
        getTrainingListAction.fulfilled.type,
        setTrainingCatalogFilterStateAction.type,

        //user dispatch
        getTrainingListAction.pending.type,
        getTrainingListAction.fulfilled.type,
        setTrainingCatalogFilterStateAction.type,
      ]);
    }, {timeout: 1500});

  });

  it('should navigate to main page if user clicks on navigate button', async () => {
    const user = userEvent.setup();
    history.push('/trainings_catalog');

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
                path='/trainings_catalog'
                element={<TrainingsCatalogFiltersDesk />}
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
