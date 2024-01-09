/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, waitFor} from '@testing-library/react';
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
import SubscriptionBlock from './subscription-block';
import { subscribeToCoachAction, unsubscribeToCoachAction } from 'src/store/api-actions';
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

describe('Component: SubscriptionBlock', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  it('should render correctly', async () => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
      },
      [SliceNameSpace.Data]: {
        subscriptionStatus: false,
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <SubscriptionBlock trainerId={3} />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(await screen.findByRole('checkbox')).toBeInTheDocument();
    expect(await screen.findByText(/Получать уведомление на почту о новой тренировке/i)).toBeInTheDocument();
    expect(await screen.findByRole('checkbox')).not.toBeChecked();
  });

  it('should dispatch subscribeToCoachAction if user clicks on unchecked checkbox', async () => {
    const user = userEvent.setup();
    mockAPI
      .onPost(`${ApiRoute.AddSubscription}/3`)
      .reply(200, 'ok');

    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
      },
      [SliceNameSpace.Data]: {
        subscriptionStatus: false,
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <SubscriptionBlock trainerId={3} />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const checkBox = await screen.findByRole('checkbox');
    expect(checkBox).not.toBeChecked();
    await user.click(checkBox);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(subscribeToCoachAction.fulfilled.type)).toBeTruthy();
    }, {timeout: 1500});
    expect(checkBox).toBeChecked();
  });

  it('should dispatch unsubscribeToCoachAction if user clicks on checked checkbox', async () => {
    const user = userEvent.setup();
    mockAPI
      .onDelete(`${ApiRoute.RemoveSubscription}/3`)
      .reply(200, 'ok');

    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
      },
      [SliceNameSpace.Data]: {
        subscriptionStatus: true,
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <SubscriptionBlock trainerId={3} />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const checkBox = await screen.findByRole('checkbox');
    expect(checkBox).toBeChecked();
    await user.click(checkBox);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(unsubscribeToCoachAction.fulfilled.type)).toBeTruthy();
    }, {timeout: 1500});
    expect(checkBox).not.toBeChecked();
  });
});
