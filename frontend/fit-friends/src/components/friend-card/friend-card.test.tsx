import { render, screen, waitFor } from '@testing-library/react';
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
import { MockUser, MockUserProfile, createTrainerMocks, createUserMocks } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import FriendCard from './friend-card';
import { Role } from 'src/types/constants';
import { createTrainingRequestStatusAction, updateTrainingRequestStatusAction } from 'src/store/api-actions';
import { UserProfileInfo } from 'src/types/user.type';
import { TrainingRequestStatus } from 'src/types/training-request.type';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

const [mockCard] = createUserMocks(1);

describe('Component: FriendCard', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
      },
    };

    store = mockStore(initialState);

  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <FriendCard
              card={mockCard}
              myRole={Role.User}
              myReadyStatus
            />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(mockCard.name)).toBeInTheDocument();
    expect(screen.getByText(mockCard.location)).toBeInTheDocument();
    expect(screen.getByAltText('user avatar')).toBeInTheDocument();
    expect(screen.getByTestId('specialisations')).toBeInTheDocument();
  });

  it('should render "invite to training" button if my role and user role is "User" and it should not render if user role is "Coach"', () => {

    const {rerender} = render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <FriendCard
              card={mockCard}
              myRole={Role.User}
              myReadyStatus
            />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Пригласить друга на совместную тренировку/i)).toBeInTheDocument();

    const [mockTrainerCard] = createTrainerMocks(1);
    rerender(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <FriendCard
              card={mockTrainerCard}
              myRole={Role.User}
              myReadyStatus
            />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Пригласить друга на совместную тренировку/i)).not.toBeInTheDocument();
  });

  it('should navigate to user page by clicking on its card', async () => {
    const user = userEvent.setup();
    history.push('/card');

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={`${AppRoute.UsersCatalog}/${mockCard.userId}`}
                element={<h1>User page</h1>}
              />
              <Route
                path='/card'
                element={
                  <FriendCard
                    card={mockCard}
                    myRole={Role.User}
                    myReadyStatus
                  />
                }
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/User page/i)).not.toBeInTheDocument();
    const card = await screen.findByTestId('friend-card');
    await user.click(card);
    expect(await screen.findByText(/User page/i)).toBeInTheDocument();
    expect(card).not.toBeInTheDocument();
  });

  it('should be enabled "invite to training" button if user is ready to training and there is no other pending request. Clicking on button fires createTrainingRequestStatusAction', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <FriendCard
              card={mockCard}
              myRole={Role.User}
              myReadyStatus
            />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const inviteBtn = await screen.findByText(/Пригласить друга на совместную тренировку/i);
    expect(inviteBtn).toBeEnabled();
    await user.click(inviteBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(createTrainingRequestStatusAction.pending.type)).toBeTruthy();
    });
  });

  it('should be disabled "invite to training" button if user is not ready to training or there is other pending request.', async () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <FriendCard
              card={{...mockCard, userProfile: {...(mockCard.userProfile as UserProfileInfo), readyForWorkout: false }}}
              myRole={Role.User}
              myReadyStatus
            />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const inviteBtn = await screen.findByRole('button', {name: /Пригласить друга на совместную тренировку/i});
    expect(inviteBtn).toBeDisabled();
  });

  it('should be rendered "accept" and "decline" buttons if user has sent to you a new pending request.', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <FriendCard
              card={{...mockCard, trainingRequestsAsSender: [{id: 'mockId', status: TrainingRequestStatus.Pending}]}}
              myRole={Role.User}
              myReadyStatus
            />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const acceptBtn = await screen.findByRole('button', {name: 'Принять'});
    const declineBtn = await screen.findByRole('button', {name: 'Отклонить'});
    expect(acceptBtn).toBeInTheDocument();
    expect(declineBtn).toBeInTheDocument();
    await user.click(acceptBtn);
    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(updateTrainingRequestStatusAction.pending.type)).toBeTruthy();
    });

  });
});
