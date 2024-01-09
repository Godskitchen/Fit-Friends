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
import { createTrainingMocks } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import PopularTrainingsBlock from './popular-trainings-block';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Component: PopularTrainingsBlock', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
      },
      [SliceNameSpace.Data]: {
        trainingList: createTrainingMocks(8),
      }
    };

    store = mockStore(initialState);
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <PopularTrainingsBlock />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Популярные тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Смотреть все/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'previous'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'next'})).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card')).toHaveLength(8);
  });

  it('should change slider offset on "next" or "prev" btn if it is not disabled', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <PopularTrainingsBlock />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const slider = await screen.findByTestId('slider');
    const nextBtn = await screen.findByRole('button', {name: 'next'});
    const prevBtn = await screen.findByRole('button', {name: 'previous'});
    expect(slider).toHaveStyle('transform: translateX(0px)');
    await user.click(nextBtn);
    expect(slider).toHaveStyle('transform: translateX(-354px)');
    await user.click(prevBtn);
    expect(slider).toHaveStyle('transform: translateX(0px)');
    expect(prevBtn).toBeDisabled();
  });

  it('should navigate to trainings catalog page if user clicks on "watch all" button', async () => {
    const user = userEvent.setup();
    history.push('/popular_trainings');

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={AppRoute.TrainingsCatalog}
                element={<h1>Trainings Catalog page</h1>}
              />
              <Route
                path='/popular_trainings'
                element={<PopularTrainingsBlock />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Trainings Catalog page/i)).not.toBeInTheDocument();
    const navigateBtn = await screen.findByRole('button', {name: 'Смотреть все'});
    await user.click(navigateBtn);
    expect(await screen.findByText(/Trainings Catalog page/i)).toBeInTheDocument();
  });
});
