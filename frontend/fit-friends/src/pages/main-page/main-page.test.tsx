import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { SliceNameSpace, AuthorizationStatus } from 'src/app-constants';
import HistoryRouter from 'src/components/history-router/history-router';
import { MockUser, MockUserProfile, createTrainingMocks, createUserMocks } from 'src/mock-constants';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import MainPage from './main.page';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Page: MainPage', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  it('should render correctly', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        trainingsDownloadingStatus: false,
        trainingList: createTrainingMocks(4),
        totalTrainingsCount: 4,
        readyUsersList: createUserMocks(7),
        specialOffersList: createTrainingMocks(3)
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        specialTrainingList: createTrainingMocks(8),
        notifications: [],
      },
      [SliceNameSpace.Main]: {
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <MainPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('profile')).not.toHaveClass('is-active');
    expect(screen.getByTestId('main')).toHaveClass('is-active');
    expect(screen.getByTestId('friends')).not.toHaveClass('is-active');

    expect(screen.getByText(/Специально подобрано для вас/i)).toBeInTheDocument();
    expect(screen.getByText(/Специальные предложения/i)).toBeInTheDocument();
    expect(screen.getByText(/Популярные тренировки/i)).toBeInTheDocument();
    expect(screen.getByText(/Ищут компанию для тренировки/i)).toBeInTheDocument();
  });
});
