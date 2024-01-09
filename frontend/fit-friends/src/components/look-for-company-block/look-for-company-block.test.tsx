import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { AppRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MockUser, MockUserProfile, createUserMocks } from 'src/mock-constants';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import LookForCompanyBlock from './look-for-company-block';
import HistoryRouter from '../history-router/history-router';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Component: LookForCompanyBlock', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.Data]: {
        usersDownloadingStatus: false,
        readyUsersList: createUserMocks(8),
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: []
      },
    };

    store = mockStore(initialState);
  });
  it('should render correctly', async () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <LookForCompanyBlock />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/Ищут компанию для тренировки/i)).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'Смотреть все'})).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'previous'})).toBeInTheDocument();
    expect(await screen.findByRole('button', {name: 'next'})).toBeInTheDocument();
    expect(await screen.findAllByTestId('user-card')).toHaveLength(8);
  });

  it('should change slider offset on "next" or "prev" btn if it is not disabled', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <LookForCompanyBlock />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const slider = await screen.findByTestId('slider');
    const nextBtn = await screen.findByRole('button', {name: 'next'});
    const prevBtn = await screen.findByRole('button', {name: 'previous'});
    expect(slider).toHaveStyle('transform: translateX(0px)');
    await user.click(nextBtn);
    expect(slider).toHaveStyle('transform: translateX(-354px)');
    await user.click(prevBtn);
    expect(slider).toHaveStyle('transform: translateX(0px)');
    expect(prevBtn).toBeDisabled();
  });

  it('should navigate to users catalog if user clicks on "watch all" button', async () => {
    const user = userEvent.setup();
    history.push('/look_for_company');

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={AppRoute.UsersCatalog}
                element={<h1>Users catalog page</h1>}
              />
              <Route
                path='/look_for_company'
                element={<LookForCompanyBlock />}
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Users catalog page/i)).not.toBeInTheDocument();
    const navigateBtn = await screen.findByRole('button', {name: 'Смотреть все'});
    await user.click(navigateBtn);
    expect(await screen.findByText(/Users catalog page/i)).toBeInTheDocument();
    expect(navigateBtn).not.toBeInTheDocument();
  });
});
