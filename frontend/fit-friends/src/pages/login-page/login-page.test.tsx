import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HttpStatusCode } from 'src/services/server-api';
import MockAdapter from 'axios-mock-adapter';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { ApiRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { Provider } from 'react-redux';
import HistoryRouter from 'src/components/history-router/history-router';
import LoginPage from './login.page';
import { HelmetProvider } from 'react-helmet-async';
import { loginAction } from 'src/store/api-actions';
import { redirectAction } from 'src/store/redirect.action';
import axios, { AxiosInstance } from 'axios';


const mockAPI = new MockAdapter(axios);
const middlewares = [thunk.withExtraArgument(axios)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, AxiosInstance, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Page: LoginPage', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
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

  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <LoginPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Вход/i)).toBeInTheDocument();
    expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByText(/Пароль/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument();
  });


  it('should enable submit button if user input is valid, and validate errors will be removed', async () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <LoginPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled();

    const emailField = screen.getByTestId('email-input');
    const passField = screen.getByTestId('password-input');

    expect(emailField).toBeInTheDocument();
    expect(passField).toBeInTheDocument();

    fireEvent.blur(emailField);
    fireEvent.blur(passField);

    await waitFor(() => {
      expect(screen.getByTestId('error-email')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-password')).toBeInTheDocument();
    });


    fireEvent.change(emailField, { target: { value: 'email@test.ru' } });
    fireEvent.change(passField, { target: { value: 'pass123' } });
    fireEvent.blur(emailField);
    fireEvent.blur(passField);

    expect(screen.getByDisplayValue(/email@test.ru/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/pass123/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('error-password')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled();
    });
  });

  it('should disable submit button if user input is invalid, and validate errors will be shown', async () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <LoginPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled();

    const emailField = screen.getByTestId('email-input');
    const passField = screen.getByTestId('password-input');

    expect(emailField).toBeInTheDocument();
    expect(passField).toBeInTheDocument();


    fireEvent.focus(emailField);
    fireEvent.focus(passField);
    fireEvent.blur(emailField);
    fireEvent.blur(passField);

    await waitFor(() => {
      expect(screen.getByTestId('error-validation-email')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-validation-password')).toBeInTheDocument();
    });


    fireEvent.change(emailField, { target: { value: 'email' } });
    fireEvent.change(passField, { target: { value: 'pass' } });
    fireEvent.blur(emailField);
    fireEvent.blur(passField);


    expect(screen.getByDisplayValue(/email/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/pass/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Некорректный формат email')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Пароль должен иметь длину от 6 до 12 символов')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled();
    });
  });

  it('should dispatch loginAction with redirectAction when user clicked to Sign In button', async () => {

    mockAPI
      .onPost(ApiRoute.Login)
      .reply(200, 'ok');

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <LoginPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const signInBtn = screen.getByRole('button', { name: 'Продолжить' });

    const emailField = screen.getByTestId('email-input');
    const passField = screen.getByTestId('password-input');

    fireEvent.change(emailField, { target: { value: 'email@test.ru' } });
    fireEvent.change(passField, { target: { value: 'pass123' } });

    await waitFor(() => {expect(signInBtn).toBeEnabled();});

    fireEvent.click(signInBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);

      expect(actions).toEqual([
        loginAction.pending.type,
        redirectAction.type,
        loginAction.fulfilled.type
      ]);
    });
  });
});
