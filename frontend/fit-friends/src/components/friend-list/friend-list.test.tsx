import { render, screen} from '@testing-library/react';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { createAPI } from 'src/services/server-api';
import { Provider } from 'react-redux';
import HistoryRouter from '../history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MockUser, MockUserProfile, createUserMocks } from 'src/mock-constants';
import { Role } from 'src/types/constants';
import FriendList from './friend-list';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Component: FriendList', () => {
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
            <FriendList
              friendCards={createUserMocks(6)}
              myRole={Role.User}
              myReadyStatus
            />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId('friend-card')).toHaveLength(6);
  });
});
