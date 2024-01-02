/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { SliceNameSpace, AuthorizationStatus, ApiRoute } from 'src/app-constants';
import HistoryRouter from 'src/components/history-router/history-router';
import { MockTrainer, MockTrainerProfile, MockUser, MockUserProfile, createOrderMocks, createTrainingMocks } from 'src/mock-constants';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import MyPurchasesPage from './my-purchases.page';
import { addPurchasesToListAction } from 'src/store/api-actions';
import userEvent from '@testing-library/user-event';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Page: MyPurchasesPage', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  it('should render correctly', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: [],
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyPurchasesPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    // header
    expect(screen.getByTestId('profile')).toHaveClass('is-active');
    expect(screen.getByTestId('main')).not.toHaveClass('is-active');
    expect(screen.getByTestId('friends')).not.toHaveClass('is-active');

    expect(screen.getByText(/Мои покупки/i)).toBeInTheDocument();
  });

  it('should render purchases list if its no empty and all purchases has been received from server. Also shouldn\'t render any button under list', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: [],
        totalMyTrainingsCount: 6,
        myTrainingsList: createTrainingMocks(6)
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyPurchasesPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Мои покупки/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card').length).toBe(6);
    expect(screen.getByTestId('show-more-btn')).not.toBeVisible();
    expect(screen.getByTestId('return-top-btn')).not.toBeVisible();

  });

  it('should render show_more button if some trainings remained on server. It should dispatch addPurchasesToListAction if user clicks on "show_more button"', async () => {

    mockAPI
      .onGet(ApiRoute.MyListBalance)
      .reply(200, {balanceList: [], totalTrainingsCount: 0});

    const user = userEvent.setup();


    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: [],
        totalMyTrainingsCount: 10,
        myTrainingsList: createTrainingMocks(4)
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyPurchasesPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Мои покупки/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card').length).toBe(4);
    expect(await screen.findByTestId('show-more-btn')).toBeVisible();
    expect(screen.getByTestId('return-top-btn')).not.toBeVisible();

    await user.click(await screen.findByTestId('show-more-btn'));

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(addPurchasesToListAction.pending.type)).toBeTruthy();
    });
  });

  it('should render "return-to-top" button if all training cards has been rendered and purchase list length more than 6 .', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: [],
        totalMyTrainingsCount: 10,
        myTrainingsList: createTrainingMocks(10)
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyPurchasesPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Мои покупки/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card').length).toBe(10);
    expect(screen.getByTestId('show-more-btn')).not.toBeVisible();
    expect(screen.getByTestId('return-top-btn')).toBeVisible();
  });
});
