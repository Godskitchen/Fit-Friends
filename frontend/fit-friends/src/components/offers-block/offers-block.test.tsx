import { render, screen } from '@testing-library/react';
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
import { MockUser, MockUserProfile, createTrainingMocks } from 'src/mock-constants';
import OffersBlock from './offers-block';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Component: OffersBlock', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  it('should render correctly', () => {

    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: []
      },
      [SliceNameSpace.Data]: {
        specialOffersList: createTrainingMocks(3)
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <OffersBlock />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Специальные предложения/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Горячие предложения на тренировки/i)).toHaveLength(3);
    expect(screen.getAllByRole('button', {name: 'слайд-1'})).toHaveLength(3);
    expect(screen.getAllByRole('button', {name: 'слайд-2'})).toHaveLength(3);
    expect(screen.getAllByRole('button', {name: 'слайд-3'})).toHaveLength(3);
  });
});
