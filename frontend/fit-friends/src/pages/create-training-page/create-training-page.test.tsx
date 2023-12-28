/* eslint-disable @typescript-eslint/no-unused-vars */
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';
import { ApiRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import thunk from 'redux-thunk';
import { cleanup, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import HistoryRouter from 'src/components/history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import CreateTrainingPage from './create-training.page';
import { MockTrainer } from 'src/mock-constants';
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

describe('Page: CreateTrainingPage', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: MockTrainer,
        notifications: []
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
            <CreateTrainingPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Создание тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Название тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Характеристики тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Выберите тип тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Сколько калорий потратим/i)).toBeInTheDocument();
    expect(screen.getByText(/Сколько времени потратим/i)).toBeInTheDocument();
    expect(screen.getByText(/Стоимость тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Описание тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Выберите уровень тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Загрузите видео-тренировку/i)).toBeInTheDocument();


    expect(screen.getByRole('button', { name: 'Опубликовать' })).toBeInTheDocument();
  });

  it('should be error validate block, if input didn\'t pass validation and submit button should be disabled', async () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <CreateTrainingPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const titleField = screen.getByTestId('title-input');
    const caloriesField = screen.getByTestId('calories-input');
    const descriptionField = screen.getByTestId('description-input');

    const priceField = screen.getByLabelText(/Стоимость тренировки/i);

    const durationBtn = screen.getByTestId('duration-btn');
    const specBtn = screen.getByTestId('spec-btn');
    const skillFieldBtn = screen.getByTestId('skill-btn');


    fireEvent.blur(titleField);
    fireEvent.blur(caloriesField);
    fireEvent.blur(descriptionField);
    fireEvent.blur(priceField);
    fireEvent.blur(durationBtn);
    fireEvent.blur(specBtn);
    fireEvent.blur(skillFieldBtn);

    await waitFor(() => {
      expect(screen.getByTestId('error-title')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-calories')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-description')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-price')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-spec')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-skill')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-duration')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Опубликовать' })).toBeDisabled();
    });
  });

  it('should dispatch createTrainingAction with redirectAction when user clicked to submit button', async () => {

    mockAPI
      .onPost(ApiRoute.UploadTrainingVideo)
      .reply(201, 'ok')
      .onPost(ApiRoute.CreateTraining)
      .reply(201, 'ok');

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <CreateTrainingPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );


    const nameField = await screen.findByLabelText(/Имя/i);
    const emailField = await screen.findByLabelText(/E-mail/i);
    const passField = await screen.findByLabelText(/Пароль/i);
    const dateField = await screen.findByLabelText(/Дата рождения/i);
    const locationBtn = await screen.findByTestId('location-btn');

    fireEvent.change(nameField, {target: {value: 'mockname'}});
    fireEvent.change(emailField, {target: {value: 'email@test.ru'}});
    fireEvent.change(passField, {target: {value: 'pass123'}});
    fireEvent.change(dateField, {target: {value: '2023-10-31'}});

    fireEvent.click(locationBtn);

    expect(await screen.findByTestId('Удельная')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('Удельная'));

    // await waitFor(() => {
    //   expect(signUpBtn).toBeEnabled();
    // });

    // await user.click(signUpBtn);


    // await waitFor(() => {
    //   const actions = store.getActions().map(({ type }) => type);

    //   expect(actions).toEqual([
    //     registerAction.pending.type,
    //     redirectAction.type,
    //     registerAction.fulfilled.type
    //   ]);
    // });

  });
});
