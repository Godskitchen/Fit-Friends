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
import { ApiRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MockUser, MockUserProfile, createNotificiationMocks } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import { deleteNotificationAction } from 'src/store/api-actions';
import MockAdapter from 'axios-mock-adapter';
import NotificationsList from './notifications-list';

const api = createAPI();
const mockApi = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Component: NotificationsList', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  it('should render notification list if its not empty and user hovers mouse on icon', async () => {
    const user = userEvent.setup();

    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: createNotificiationMocks(5)
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <NotificationsList />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(await screen.findByTestId('notifications')).not.toHaveClass('is-active');
    await user.hover(screen.getByTestId('notifications'));
    expect(await screen.findByTestId('notifications')).toHaveClass('is-active');
    expect(await screen.findByText('Оповещения')).toBeVisible();
    await user.unhover(screen.getByTestId('notifications'));
    expect(await screen.findByTestId('notifications')).not.toHaveClass('is-active');
  });

  it('should dispatch deleteNotificationAction by clicking on notification', async () => {
    const user = userEvent.setup();
    mockApi
      .onDelete(`${ApiRoute.Notifications}/mockid-1`)
      .reply(200, 'ok')
      .onGet(ApiRoute.Notifications)
      .reply(200, []);


    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: createNotificiationMocks(5)
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <NotificationsList />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    await user.hover(screen.getByTestId('notifications'));
    expect(await screen.findByTestId('notifications')).toHaveClass('is-active');

    const messages = await screen.findAllByTestId('notification');
    expect(messages).toHaveLength(5);
    await user.click(messages[0]);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(deleteNotificationAction.fulfilled.type)).toBeTruthy();
    });
  });
});
