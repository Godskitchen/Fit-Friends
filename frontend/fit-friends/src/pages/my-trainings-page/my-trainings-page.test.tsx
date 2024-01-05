import { render, screen, waitFor } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { SliceNameSpace, AuthorizationStatus, ApiRoute } from 'src/app-constants';
import HistoryRouter from 'src/components/history-router/history-router';
import { MockTrainer, MockTrainerProfile, createTrainingMocks } from 'src/mock-constants';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { addMyTrainingsToListAction } from 'src/store/api-actions';
import userEvent from '@testing-library/user-event';
import MyTrainingsPage from './my-trainings.page';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Page: MyTrainingsPage', () => {
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
      },
      [SliceNameSpace.Main]: {
        myTrainingsFilterState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyTrainingsPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    // header
    expect(screen.getByTestId('profile')).not.toHaveClass('is-active');
    expect(screen.getByTestId('main')).toHaveClass('is-active');
    expect(screen.getByTestId('friends')).not.toHaveClass('is-active');

    expect(screen.getAllByText(/Мои тренировки/i)[0]).toBeInTheDocument();
  });

  it('should render trainings list if its no empty and all trainings has been received from server. Also shouldn\'t render any button under list', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
        notifications: [],
        totalMyTrainingsCount: 6,
        myTrainingsList: createTrainingMocks(6)
      },
      [SliceNameSpace.Main]: {
        myTrainingsFilterState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyTrainingsPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getAllByText(/Мои тренировки/i)[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card').length).toBe(6);
    expect(screen.getByText('Показать еще')).not.toBeVisible();
    expect(screen.getByText('Вернуться в начало')).not.toBeVisible();

  });

  it('should render show_more button if some trainings remained on server. It should dispatch addTrainingdToListAction if user clicks on "show_more button"', async () => {

    mockAPI
      .onGet(ApiRoute.MyTrainings)
      .reply(200, {trainingList: [], totalTrainingsCount: 0});

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
        myTrainingsList: createTrainingMocks(6)
      },
      [SliceNameSpace.Main]: {
        myTrainingsFilterState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyTrainingsPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getAllByText(/Мои тренировки/i)[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card').length).toBe(6);
    expect(await screen.findByText('Показать еще')).toBeVisible();
    expect(await screen.findByText('Вернуться в начало')).not.toBeVisible();

    await user.click(await screen.findByText('Показать еще'));

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(addMyTrainingsToListAction.pending.type)).toBeTruthy();
    });
  });

  it('should render "return-to-top" button if all training cards has been rendered and purchase list length more than 6 .', async () => {

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
      [SliceNameSpace.Main]: {
        myTrainingsFilterState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MyTrainingsPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getAllByText(/Мои тренировки/i)[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card').length).toBe(10);
    expect(await screen.findByText('Показать еще')).not.toBeVisible();
    expect(await screen.findByText('Вернуться в начало')).toBeVisible();
  });
});
