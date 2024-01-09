import { cleanup, render, screen } from '@testing-library/react';
import CertificateSlider from './certificate-slider';
import HistoryRouter from '../history-router/history-router';
import { Provider } from 'react-redux';
import { createAPI } from 'src/services/server-api';
import { createBrowserHistory } from 'history';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from 'src/types/state.type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import { Action } from '@reduxjs/toolkit';
import { AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MockTrainer, MockTrainerProfile } from 'src/mock-constants';

jest.mock('src/utils/pdf-thumbnailer',
  () => (_cert: string) => 'http://localhost:4000/static/users/backs/user-3.png'
);

jest.mock('nanoid', () => ({
  customAlphabet: (_alphabet: string, _defaultSize?: number) => {
    let idCounter = 1;
    return () => idCounter++;
  }})
);

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();

describe('Component: CertificateSlider', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
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
          <CertificateSlider />
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Дипломы и сертификаты/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Загрузить'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'previous'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'next'})).toBeDisabled();
  });
});
