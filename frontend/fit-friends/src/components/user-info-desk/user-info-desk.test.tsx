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
import { ApiRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MockUser, MockUserProfile } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import UserInfoDesk from './user-info-desk';
import { updateProfileAction } from 'src/store/api-actions';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();
describe('Component: UserInfoDesk', () => {
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
      .onPost(ApiRoute.UploadAvatar)
      .reply(201, 'ok')
      .onPatch(`${ApiRoute.UserDetails}/${MockUser.userId}`)
      .reply(200, 'ok');
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <UserInfoDesk myProfile={{...MockUser, userProfile: MockUserProfile}} />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Обо мне/i)).toBeInTheDocument();
    expect(screen.getByText(/Имя/i)).toBeInTheDocument();
    expect(screen.getByText(/Описание/i)).toBeInTheDocument();
    expect(screen.getByText(/Статус/i)).toBeInTheDocument();
    expect(screen.getByText(/Специализация/i)).toBeInTheDocument();
    expect(screen.getByText(/Локация/i)).toBeInTheDocument();
    expect(screen.getByText(/Пол/i)).toBeInTheDocument();
    expect(screen.getByText(/Уровень/i)).toBeInTheDocument();
  });

  it('all inputs should be disabled if desk is not in edit mode', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <UserInfoDesk myProfile={{...MockUser, userProfile: MockUserProfile}} />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const nameInput = await screen.findByLabelText('Имя');
    const aboutInfoInput = await screen.findByLabelText('Описание');
    expect(nameInput).toBeDisabled();
    expect(aboutInfoInput).toBeDisabled();

    const editBtn = await screen.findByRole('button', {name: 'Редактировать'});
    expect(editBtn).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Сохранить'})).not.toBeInTheDocument();

    await user.click(editBtn);
    expect(screen.getByRole('button', {name: 'Сохранить'})).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Редактировать'})).not.toBeInTheDocument();

    expect(nameInput).toBeEnabled();
    expect(aboutInfoInput).toBeEnabled();
  });

  it('should not dispatch updateProfileAction if no field has changed', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <UserInfoDesk myProfile={{...MockUser, userProfile: MockUserProfile}} />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const editBtn = await screen.findByRole('button', {name: 'Редактировать'});
    await user.click(editBtn);

    const saveBtn = await screen.findByRole('button', {name: 'Сохранить'});
    await user.click(saveBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(updateProfileAction.pending.type)).toBeFalsy();
    });
  });

  it('should dispatch updateProfileAction if some field has changed', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <UserInfoDesk myProfile={{...MockUser, userProfile: MockUserProfile}} />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const editBtn = await screen.findByRole('button', {name: 'Редактировать'});
    await user.click(editBtn);

    const nameInput = await screen.findByLabelText('Имя');
    await user.type(nameInput, 'newName');

    const saveBtn = await screen.findByRole('button', {name: 'Сохранить'});
    await user.click(saveBtn);

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(updateProfileAction.pending.type)).toBeTruthy();
    });
  });
});

