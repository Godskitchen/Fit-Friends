/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, fireEvent, waitFor, cleanup, getByLabelText } from '@testing-library/react';
import { HttpStatusCode, createAPI } from 'src/services/server-api';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { ApiRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { Provider } from 'react-redux';
import HistoryRouter from 'src/components/history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import { loginAction, registerAction } from 'src/store/api-actions';
import { redirectAction } from 'src/store/redirect.action';
import RegistrationPage from './registration.page';
import { MOCK_AVATAR } from 'src/mock-constants';
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

describe('Page: RegistrationPage', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    window.URL.createObjectURL = jest.fn(() => 'someUrl');

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        formErrors: {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.UNAUTHORIZED]: '',
        }
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
            <RegistrationPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Регистрация/i)).toBeInTheDocument();
    expect(screen.getByText(/Загрузите фото профиля/i)).toBeInTheDocument();
    expect(screen.getByText(/Имя/i)).toBeInTheDocument();
    expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByText(/Дата рождения/i)).toBeInTheDocument();
    expect(screen.getByText(/Ваша локация/i)).toBeInTheDocument();
    expect(screen.getByText(/Пароль/i)).toBeInTheDocument();
    expect(screen.getByTestId('agreement')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument();
  });


  it('should be error validate block, if input didn\'t pass validation and submit button should be disabled', async () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <RegistrationPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const nameField = screen.getByLabelText(/Имя/i);
    const emailField = screen.getByLabelText(/E-mail/i);
    const passField = screen.getByLabelText(/Пароль/i);
    const dateField = screen.getByLabelText(/Дата рождения/i);
    const locationBtn = screen.getByTestId('location-btn');

    fireEvent.blur(nameField);
    fireEvent.blur(emailField);
    fireEvent.blur(passField);
    fireEvent.blur(dateField);
    fireEvent.blur(locationBtn);

    await waitFor(() => {
      expect(screen.getByTestId('error-name')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-email')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-password')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-date')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-location')).toHaveTextContent('Поле обязательно для заполнения');
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled();
    });
  });

  it('should render avatar thumbnail if choose image has passed validation', async () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <RegistrationPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const avatarInput = screen.getByTestId('avatar-input');

    const blob = new Blob([new Uint8Array(MOCK_AVATAR), 'additional-data'], { type: 'image/png' });
    const mockAvatar = new File([blob], 'mock.png', {type: 'image/png'});
    fireEvent.change(avatarInput, { target: { files: [mockAvatar] } });

    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByAltText('user avatar')).toBeInTheDocument();
    });
  });

  it('should dispatch registerAction with redirectAction when user clicked to Sign Up button', async () => {

    mockAPI
      .onPost(ApiRoute.UploadAvatar)
      .reply(201, 'ok')
      .onPost(ApiRoute.Register)
      .reply(201, 'ok');

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <RegistrationPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const signUpBtn = await screen.findByRole('button', { name: 'Продолжить' });
    expect(signUpBtn).toBeDisabled();

    const avatarInput = await screen.findByTestId('avatar-input');
    const blob = new Blob([new Uint8Array(MOCK_AVATAR)], { type: 'image/png' });
    const mockAvatar = new File([blob], 'mock.png', {type: 'image/png'});

    await user.upload(avatarInput, mockAvatar);

    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByAltText('user avatar')).toBeInTheDocument();
    });

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

    await waitFor(() => {
      expect(signUpBtn).toBeEnabled();
    });

    await user.click(signUpBtn);


    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);

      expect(actions).toEqual([
        registerAction.pending.type,
        redirectAction.type,
        registerAction.fulfilled.type
      ]);
    });

  });
});
