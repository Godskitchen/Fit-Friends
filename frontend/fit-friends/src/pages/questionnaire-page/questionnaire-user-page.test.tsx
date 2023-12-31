/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { ApiRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MOCK_PDF, MockTrainer, MockUser } from 'src/mock-constants';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import HistoryRouter from 'src/components/history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import QuestionnaireCoachPage from './questionnaire-coach.page';
import userEvent from '@testing-library/user-event';
import { TRAINING_TYPE_COUNT_VALIDATION_MESSAGE } from 'src/utils/validators/user/constants';
import { redirectAction } from 'src/store/redirect.action';
import { createCoachProfileAction, createUserProfileAction } from 'src/store/api-actions';
import QuestionnaireUserPage from './questionnaire-user.page';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Page: QuestionnaireUserPage', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: MockUser,
      }
    };

    store = mockStore(initialState);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <QuestionnaireUserPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Опросник/i)).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Ваша специализация (тип) тренировок'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Сколько калорий хотите сбросить'))).toBeInTheDocument();
    expect(screen.getByText(/Сколько калорий тратить в день/i)).toBeInTheDocument();

    expect(screen.getByRole('button', {name: 'Продолжить'})).toBeInTheDocument();
  });

  it('should be error message if user choosed more than 3 specs', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <QuestionnaireUserPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const specialisations = screen.getAllByTestId('specialisations');
    expect(specialisations.length).toStrictEqual(8);
    await user.click(specialisations[0]);
    await user.click(specialisations[1]);
    await user.click(specialisations[2]);

    await waitFor(() => {
      expect(screen.queryByText(TRAINING_TYPE_COUNT_VALIDATION_MESSAGE)).not.toBeInTheDocument();
    });

    await user.click(specialisations[3]);

    await waitFor(() => {
      expect(screen.getByText(TRAINING_TYPE_COUNT_VALIDATION_MESSAGE)).toBeInTheDocument();
    });

    await user.click(specialisations[0]);

    await waitFor(() => {
      expect(screen.queryByText(TRAINING_TYPE_COUNT_VALIDATION_MESSAGE)).not.toBeInTheDocument();
    });
  });

  it('should dispatch createCoachProfile action and redirect action, when user click on submit button', async () => {

    mockAPI
      .onPost(ApiRoute.UploadCertificate)
      .reply(201, 'ok')
      .onPost(`${ApiRoute.UserDetails}/1/create`)
      .reply(201, 'ok');

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <QuestionnaireUserPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled();
    });

    const specialisations = screen.getAllByTestId('specialisations');
    const caloriesIntakeField = screen.getByTestId('calories-intake');
    const caloriesToBurnField = screen.getByTestId('calories-to-burn');

    await user.click(specialisations[0]);

    fireEvent.change(caloriesIntakeField, {target: {value: 2000}});
    fireEvent.change(caloriesToBurnField, {target: {value: 2000}});

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Продолжить' }));


    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);

      expect(actions).toEqual([
        createUserProfileAction.pending.type,
        redirectAction.type,
        createUserProfileAction.fulfilled.type
      ]);
    });
  });
});
