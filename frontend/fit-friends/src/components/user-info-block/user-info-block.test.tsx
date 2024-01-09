import { render, screen, waitFor } from '@testing-library/react';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { createAPI } from 'src/services/server-api';
import { Provider } from 'react-redux';
import HistoryRouter from '../history-router/history-router';
import { ApiRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { createUserMocks } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import UserInfoBlock from './user-info-block';
import { Role } from 'src/types/constants';
import { addUserToFriendsAction, removeUserFromFriendsAction } from 'src/store/api-actions';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

const [mockUser] = createUserMocks(1);
describe('Component: UserInfoBlock', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
      },
    };

    store = mockStore(initialState);

    mockAPI
      .onPatch(`${ApiRoute.FriendsList}/add/${mockUser.userId}`)
      .reply(200, 'ok')
      .onPatch(`${ApiRoute.FriendsList}/remove/${mockUser.userId}`)
      .reply(200, 'ok');
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <UserInfoBlock
            user={{...mockUser, isFriend: true}}
            myId={1}
            myRole={Role.User}
          />
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Карточка пользователя/i)).toBeInTheDocument();
    expect(screen.getByTestId('name')).toHaveTextContent(mockUser.name);
    expect(screen.getByText(mockUser.location)).toBeInTheDocument();
    expect(screen.getByText(mockUser.aboutInfo)).toBeInTheDocument();
  });

  it('should render "add_friend" button if user is not friend. Click on button dispatches addFriendAction and change button to "remove_friend"', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <UserInfoBlock
            user={{...mockUser, isFriend: false}}
            myId={1}
            myRole={Role.User}
          />
        </HistoryRouter>
      </Provider>
    );

    const addFriendBtn = await screen.findByRole('button', {name: 'Добавить в друзья'});
    expect(addFriendBtn).toBeInTheDocument();
    await user.click(addFriendBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(addUserToFriendsAction.fulfilled.type)).toBeTruthy();
    });

    expect(await screen.findByRole('button', {name: 'Удалить из друзей'})).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Добавить в друзья'})).not.toBeInTheDocument();
  });

  it('should render "remove_friend" button if user is friend. Click on button dispatches removeFriendAction and change button to "add_friend"', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <UserInfoBlock
            user={{...mockUser, isFriend: true}}
            myId={1}
            myRole={Role.User}
          />
        </HistoryRouter>
      </Provider>
    );

    const removeFriendBtn = await screen.findByRole('button', {name: 'Удалить из друзей'});
    expect(removeFriendBtn).toBeInTheDocument();
    await user.click(removeFriendBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(removeUserFromFriendsAction.fulfilled.type)).toBeTruthy();
    });

    expect(await screen.findByRole('button', {name: 'Добавить в друзья'})).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Удалить из друзей'})).not.toBeInTheDocument();
  });

  it('should open location modal window if user clicks on location button and this window closes if user press "esc" key', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <UserInfoBlock
            user={{...mockUser, isFriend: true}}
            myId={1}
            myRole={Role.User}
          />
        </HistoryRouter>
      </Provider>
    );

    const locationBtn = screen.getByTestId('location-btn');
    const locationModal = await screen.findByTestId('location-modal');
    expect(locationModal).not.toHaveClass('is-active');
    await user.click(locationBtn);
    expect(locationModal).toHaveClass('is-active');
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(locationModal).not.toHaveClass('is-active');
    });
  });
});

