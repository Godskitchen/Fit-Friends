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
import { createTrainerMocks, createTrainingMocks } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { Role } from 'src/types/constants';
import { addUserToFriendsAction, createTrainingRequestStatusAction, removeUserFromFriendsAction } from 'src/store/api-actions';
import CoachInfoBlock from './coach-info-block';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

const [mockTrainer] = createTrainerMocks(1);
describe('Component: CoachInfoBlock', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
      },
      [SliceNameSpace.Data]: {
        trainingList: createTrainingMocks(4),
      }
    };

    store = mockStore(initialState);

    mockAPI
      .onPatch(`${ApiRoute.FriendsList}/add/${mockTrainer.userId}`)
      .reply(200, 'ok')
      .onPatch(`${ApiRoute.FriendsList}/remove/${mockTrainer.userId}`)
      .reply(200, 'ok')
      .onPost(`${ApiRoute.CreateTrainingRequest}/${mockTrainer.userId}`)
      .reply(200, 'ok');
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <CoachInfoBlock
            user={{...mockTrainer, isFriend: true}}
            myRole={Role.User}
          />
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Карточка пользователя роль тренер/i)).toBeInTheDocument();
    expect(screen.getByTestId('name')).toHaveTextContent(mockTrainer.name);
    expect(screen.getByText(mockTrainer.location)).toBeInTheDocument();
    expect(screen.getByText(mockTrainer.aboutInfo)).toBeInTheDocument();
    expect(screen.getByText(/Тренировки/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card')).toHaveLength(4);
  });

  it('should render "add_friend" button if user is not friend. Click on button dispatches addFriendAction and change button to "remove_friend"', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <CoachInfoBlock
            user={{...mockTrainer, isFriend: false}}
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
          <CoachInfoBlock
            user={{...mockTrainer, isFriend: true}}
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
          <CoachInfoBlock
            user={{...mockTrainer, isFriend: true}}
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

  it('should render "training_request" button if coach is friend, he is ready to training and there is no other pending request. Clicking on it dispatches createTrainingRequestAction"', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <CoachInfoBlock
            user={{...mockTrainer, isFriend: true}}
            myRole={Role.User}
          />
        </HistoryRouter>
      </Provider>
    );

    const trainingRequestBtn = await screen.findByRole('button', {name: 'Хочу персональную тренировку'});
    expect(trainingRequestBtn).toBeEnabled();
    await user.click(trainingRequestBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(createTrainingRequestStatusAction.fulfilled.type)).toBeTruthy();
    });

    expect(await screen.findByRole('button', {name: 'Заявка на тренировку отправлена'})).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'Заявка на тренировку отправлена'})).toBeDisabled();
  });
});

