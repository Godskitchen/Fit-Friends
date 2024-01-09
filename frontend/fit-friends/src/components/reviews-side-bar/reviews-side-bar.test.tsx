/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, waitFor } from '@testing-library/react';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { HttpStatusCode, createAPI } from 'src/services/server-api';
import { Provider } from 'react-redux';
import HistoryRouter from '../history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import { ApiRoute, AppRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MockUser, MockUserProfile, createReplyMocks } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import { getUsersListAction } from 'src/store/api-actions';
import MockAdapter from 'axios-mock-adapter';
import { setUsersCatalogFilterStateAction } from 'src/store/main-process/main-process.reducer';
import { Route, Routes } from 'react-router-dom';
import ReviewsSideBar from './reviews-side-bar';
import { Role } from 'src/types/constants';

const api = createAPI();
const mockAPI = new MockAdapter(api);
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();
describe('Component: ReviewsSideBar', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        formErrors: {
          [HttpStatusCode.CONFLICT]: '',
          [HttpStatusCode.UNAUTHORIZED]: ''
        }
      },
      [SliceNameSpace.Data]: {
        totalRepliesCount: 4,
        replyList: createReplyMocks(4)
      }
    };

    store = mockStore(initialState);

    // mockAPI
    //   .onGet(ApiRoute.UsersList)
    //   .reply(200, {userList: [], totalUserList: 0});
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <ReviewsSideBar
            trainingId={4}
            myRole={Role.User}
            trainingAmount={0}
          />
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText('Отзывы')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Оставить отзыв'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Назад'})).toBeInTheDocument();
    expect(screen.getAllByTestId('reply-card')).toHaveLength(4);
  });

  it('should open reply modal window if user clicks on "send reply" and this window closes if user press "esc" key', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <ReviewsSideBar
            trainingId={4}
            myRole={Role.User}
            trainingAmount={0}
          />
        </HistoryRouter>
      </Provider>
    );

    const sendReplyBtn = await screen.findByRole('button', {name: 'Оставить отзыв'});
    const replyModal = await screen.findByTestId('reply-modal');
    expect(replyModal).not.toHaveClass('is-active');
    await user.click(sendReplyBtn);
    expect(replyModal).toHaveClass('is-active');
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(replyModal).not.toHaveClass('is-active');
    });
  });

  it('"open modal" button should be disabled if trainingAmount < 0', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <ReviewsSideBar
            trainingId={4}
            myRole={Role.User}
            trainingAmount={-1}
          />
        </HistoryRouter>
      </Provider>
    );

    const sendReplyBtn = await screen.findByRole('button', {name: 'Оставить отзыв'});
    expect(sendReplyBtn).toBeDisabled();
  });


  it('should navigate to trainings catalog if user clicks on navigate button', async () => {
    const user = userEvent.setup();
    history.push('/reviews');

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <Routes>
              <Route
                path={AppRoute.TrainingsCatalog}
                element={<h1>Trainings Catalog Page</h1>}
              />
              <Route
                path='/reviews'
                element={
                  <ReviewsSideBar
                    trainingId={4}
                    myRole={Role.User}
                    trainingAmount={-1}
                  />
                }
              />
            </Routes>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Trainings Catalog Page/i)).not.toBeInTheDocument();
    const navigateBtn = await screen.findByRole('button', {name: 'Назад'});
    await user.click(navigateBtn);
    expect(await screen.findByText(/Trainings Catalog Page/i)).toBeInTheDocument();
    expect(navigateBtn).not.toBeInTheDocument();
  });
});
