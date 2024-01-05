import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HttpStatusCode, createAPI } from 'src/services/server-api';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { Provider } from 'react-redux';
import HistoryRouter from 'src/components/history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import userEvent from '@testing-library/user-event';
import TrainingPage from './training.page';
import { MockTraining, MockUser, MockUserProfile } from 'src/mock-constants';
import Router from 'react-router';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
} as object));

const trainingInfo = {...MockTraining};
const mockId = trainingInfo.trainingId;

const history = createBrowserHistory();

describe('Page: TrainingPage', () => {

  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    window.URL.createObjectURL = jest.fn(() => 'someUrl');
  });

  it('should render correctly', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ trainingId: `${mockId}` });

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        replyList: [],
        trainingInfo,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile},
        notifications: [],
        formErrors: {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.UNAUTHORIZED]: '',
        },
        remainingTrainingAmount: 0,
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Карточка тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Отзывы/i)).toBeInTheDocument();
    expect(screen.getByText(/Информация о тренировке/i)).toBeInTheDocument();
    expect(screen.getByText(/Стоимость/i)).toBeInTheDocument();
    expect(screen.getByText(/Видео/i)).toBeInTheDocument();
  });


  it('should render "buy_training" button, if user with role=user watches page. "Edit" button should be hidden. "Buy_button" should be enabled if remainingTrainingCount <= 0', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ trainingId: `${mockId}` });

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        replyList: [],
        trainingInfo,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile},
        notifications: [],
        formErrors: {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.UNAUTHORIZED]: '',
        },
        remainingTrainingAmount: 0,
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const buyBtn = screen.getByTestId('buy-btn');
    expect(buyBtn).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Редактировать'})).not.toBeInTheDocument();
    expect(buyBtn).toBeEnabled();
    expect(screen.getByRole('button', {name: 'Приступить'})).toBeDisabled();
  });

  it('should render training video error message if error event has been fired', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ trainingId: `${mockId}` });

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        replyList: [],
        trainingInfo
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile},
        notifications: [],
        formErrors: {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.UNAUTHORIZED]: '',
        },
        remainingTrainingAmount: 0,
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const videoPlayer = await screen.findByTestId('video-player');
    expect(screen.getByText(/Видео/i)).toBeInTheDocument();
    fireEvent.error(videoPlayer);
    expect(await screen.findByText(/Видео тренировки на данный момент недоступно/i)).toBeInTheDocument();
  });

  it('should open purchase modal window if user clicks on "buy_button" and this window closes if user press "esc" key', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ trainingId: `${mockId}` });

    const user = userEvent.setup();

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        replyList: [],
        trainingInfo
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile},
        notifications: [],
        formErrors: {
          [HttpStatusCode.CONFLICT]: '',
        },
        remainingTrainingAmount: 0,
      },
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const buyBtn = screen.getByTestId('buy-btn');
    const purchaseModal = await screen.findByTestId('purchase-modal');
    expect(purchaseModal).not.toHaveClass('is-active');
    await user.click(buyBtn);
    expect(purchaseModal).toHaveClass('is-active');
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(purchaseModal).not.toHaveClass('is-active');
    });
  });
});
