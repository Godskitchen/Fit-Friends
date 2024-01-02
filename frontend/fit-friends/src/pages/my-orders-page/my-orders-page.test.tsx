import { render, screen, waitFor } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { SliceNameSpace, AuthorizationStatus, ApiRoute } from 'src/app-constants';
import HistoryRouter from 'src/components/history-router/history-router';
import { MockTrainer, MockTrainerProfile, createOrderMocks } from 'src/mock-constants';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import MyOrdersPage from './my-orders.page';
import { addOrdersToListAction } from 'src/store/api-actions';
import MockAdapter from 'axios-mock-adapter';
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

describe('Page: MyOrdersPage', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  it('should render correctly', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: [],
        totalOrdersCount: 0,
        orderList: []
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyOrdersPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    // header
    expect(screen.getByTestId('profile')).not.toHaveClass('is-active');
    expect(screen.getByTestId('main')).toHaveClass('is-active');
    expect(screen.getByTestId('friends')).not.toHaveClass('is-active');

    expect(screen.getByText(/Мои заказы/i)).toBeInTheDocument();
  });

  it('should render order list if its no empty and all orders has been received from server. Also shouldn\'t render any button under list', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: [],
        totalOrdersCount: 4,
        orderList: createOrderMocks(4)
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyOrdersPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Мои заказы/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('order-card').length).toBe(4);
    expect(screen.getByTestId('show-more-btn')).not.toBeVisible();
    expect(screen.getByTestId('return-top-btn')).not.toBeVisible();

  });

  it('should render show_more button if some orders remained on server. It should dispatch addOrdersToListAction if user clicks on "show_more button"', async () => {

    mockAPI
      .onGet(ApiRoute.CoachOrdersList)
      .reply(200, {orderList: [], totalOrdersCount: 0});

    const user = userEvent.setup();


    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: [],
        totalOrdersCount: 10,
        orderList: createOrderMocks(4)
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyOrdersPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Мои заказы/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('order-card').length).toBe(4);
    expect(screen.getByTestId('show-more-btn')).toBeVisible();
    expect(screen.getByTestId('return-top-btn')).not.toBeVisible();

    await user.click(screen.getByTestId('show-more-btn'));

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(addOrdersToListAction.pending.type)).toBeTruthy();
    });
  });

  it('should render "return-to-top" button if all order cards has been rendered and order list length more than 4 .', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: [],
        totalOrdersCount: 10,
        orderList: createOrderMocks(10)
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyOrdersPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Мои заказы/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('order-card').length).toBe(10);
    expect(screen.getByTestId('show-more-btn')).not.toBeVisible();
    expect(screen.getByTestId('return-top-btn')).toBeVisible();
  });
});
