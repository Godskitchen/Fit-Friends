import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { SliceNameSpace, AuthorizationStatus } from 'src/app-constants';
import HistoryRouter from 'src/components/history-router/history-router';
import { MockUser, MockUserProfile, createTrainingMocks } from 'src/mock-constants';
import { createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { addTrainingsToListAction } from 'src/store/api-actions';
import TrainingCatalogPage from './trainings-catalog.page';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Page: TrainingsCatalogPage', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  it('should render correctly', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        totalTrainingsCount: 0,
        trainingList: []
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: [],
      },
      [SliceNameSpace.Main]: {
        trainingsCatalogFilterState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingCatalogPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    // header
    expect(screen.getByTestId('profile')).not.toHaveClass('is-active');
    expect(screen.getByTestId('main')).toHaveClass('is-active');
    expect(screen.getByTestId('friends')).not.toHaveClass('is-active');

    expect(screen.getByText('Каталог тренировок')).toBeInTheDocument();
    expect(screen.getByText('Каталог тренировок Фильтр')).toBeInTheDocument();
    expect(screen.getByText(/Фильтры/i)).toBeInTheDocument();
  });

  it('should render training list if its no empty and all trainings has been received from server. Also shouldn\'t render any button under list', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        totalTrainingsCount: 6,
        trainingList: createTrainingMocks(6)
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: [],
      },
      [SliceNameSpace.Main]: {
        trainingsCatalogFilterState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingCatalogPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText('Каталог тренировок')).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card').length).toBe(6);
    expect(screen.getByText(/Показать еще/i)).not.toBeVisible();
    expect(screen.getByText(/Вернуться в начало/i)).not.toBeVisible();
  });

  it('should render show_more button if some trainings remained on server. It should dispatch addTrainingsToListAction if user clicks on "show_more button"', async () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        totalTrainingsCount: 10,
        trainingList: createTrainingMocks(6)
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: [],
      },
      [SliceNameSpace.Main]: {
        trainingsCatalogFilterState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingCatalogPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText('Каталог тренировок')).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card').length).toBe(6);
    expect(screen.getByText(/Показать еще/i)).toBeVisible();
    expect(screen.getByText(/Вернуться в начало/i)).not.toBeVisible();

    fireEvent.click(screen.getByText(/Показать еще/i));

    await waitFor(() => {
      const actions = store.getActions().map(({ type }) => type);
      expect(actions.includes(addTrainingsToListAction.pending.type)).toBeTruthy();
    });
  });

  it('should render "return-to-top" button if all training cards has been rendered and training list length more than 6 .', () => {

    initialState = {
      [SliceNameSpace.Data]: {
        dataUploadingStatus: false,
        totalTrainingsCount: 10,
        trainingList: createTrainingMocks(10)
      },
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        notifications: [],
      },
      [SliceNameSpace.Main]: {
        trainingsCatalogFilterState: {}
      }
    };

    store = mockStore(initialState);

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <TrainingCatalogPage />
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText('Каталог тренировок')).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card').length).toBe(10);
    expect(screen.getByText(/Показать еще/i)).not.toBeVisible();
    expect(screen.getByText(/Вернуться в начало/i)).toBeVisible();
  });
});
