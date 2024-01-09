/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ApiRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { createTrainingMocks } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import CoachTrainingsBlock from './coach-trainings-block';
import MockAdapter from 'axios-mock-adapter';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();


describe('Component: CoachTrainingsBlock', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
      },
      [SliceNameSpace.Data]: {
        trainingList: createTrainingMocks(8),
        totalTrainingsCount: 8
      }
    };

    store = mockStore(initialState);

    mockAPI
      .onGet(ApiRoute.TrainingList)
      .reply(200, {trainingList: [], totalTrainingsCount: 0});
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <CoachTrainingsBlock trainerId={2}/>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Тренировки/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'back'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'next'})).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card')).toHaveLength(8);
  });

  it('should change slider offset on "next" or "prev" btn if it is not disabled. Maximum offset step is 4 cards depending of training list length', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <CoachTrainingsBlock trainerId={2}/>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const slider = await screen.findByTestId('slider');
    const nextBtn = await screen.findByRole('button', {name: 'next'});
    const prevBtn = await screen.findByRole('button', {name: 'back'});
    expect(slider).toHaveStyle('transform: translateX(0px)');
    await user.click(nextBtn);
    expect(slider).toHaveStyle('transform: translateX(-1416px)');
    await user.click(prevBtn);
    expect(slider).toHaveStyle('transform: translateX(0px)');
    expect(prevBtn).toBeDisabled();
  });
});
