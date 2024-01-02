import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { SliceNameSpace, AuthorizationStatus } from 'src/app-constants';
import HistoryRouter from 'src/components/history-router/history-router';
import { MockTrainer, MockTrainerProfile, createUserMocks } from 'src/mock-constants';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import MyFriendsPage from './my-friends-page';
import { addFriendsToListAction } from 'src/store/api-actions';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Page: MyFriendsPage', () => {
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
        totalFriendsCount: 0,
        friendList: []
      },
      [SliceNameSpace.Main]: {
        friendsQueryState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyFriendsPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    // header
    expect(screen.getByTestId('profile')).not.toHaveClass('is-active');
    expect(screen.getByTestId('main')).not.toHaveClass('is-active');
    expect(screen.getByTestId('friends')).toHaveClass('is-active');

    expect(screen.getByText(/Мои друзья/i)).toBeInTheDocument();
  });

  it('should render friend list if its no empty and all users has been received from server. Also shouldn\'t render any button under list', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: [],
        totalFriendsCount: 6,
        friendList: createUserMocks(6)
      },
      [SliceNameSpace.Main]: {
        friendsQueryState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyFriendsPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Мои друзья/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('friend-card').length).toBe(6);
    expect(screen.getByTestId('show-more-btn')).not.toBeVisible();
    expect(screen.getByTestId('return-top-btn')).not.toBeVisible();

  });

  it('should render show_more button if some users remained on server. It should dispatch addFriendsToListAction if user clicks on "show_more button"', async () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: [],
        totalFriendsCount: 10,
        friendList: createUserMocks(6)
      },
      [SliceNameSpace.Main]: {
        friendsQueryState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyFriendsPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Мои друзья/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('friend-card').length).toBe(6);
    expect(screen.getByTestId('show-more-btn')).toBeVisible();
    expect(screen.getByTestId('return-top-btn')).not.toBeVisible();

    fireEvent.click(screen.getByTestId('show-more-btn'));

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(addFriendsToListAction.pending.type)).toBeTruthy();
    });
  });

  it('should render "return-to-top" button if all user cards has been rendered and userlist more than 6 .', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: [],
        totalFriendsCount: 10,
        friendList: createUserMocks(10)
      },
      [SliceNameSpace.Main]: {
        friendsQueryState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyFriendsPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Мои друзья/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('friend-card').length).toBe(10);
    expect(screen.getByTestId('show-more-btn')).not.toBeVisible();
    expect(screen.getByTestId('return-top-btn')).toBeVisible();
  });
});
