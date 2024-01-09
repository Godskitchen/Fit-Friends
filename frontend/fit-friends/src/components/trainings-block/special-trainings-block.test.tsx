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
import { createTrainingMocks } from 'src/mock-constants';
import userEvent from '@testing-library/user-event';
import SpecialTrainingsBlock from './special-trainings-block';
import { UserProfileInfo } from 'src/types/user.type';
import { SkillLevel, Specialisation, TrainingDuration } from 'src/types/constants';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

const history = createBrowserHistory();
const mockProfileInfo: UserProfileInfo = {
  skillLevel: SkillLevel.Pro,
  specialisations: [Specialisation.Aerobics, Specialisation.Crossfit],
  trainingDuration: TrainingDuration.FiftyToEightyMinutes,
  caloriesToBurn: 1500,
  dailyCaloriesIntake: 1200,
  readyForWorkout: true
};

describe('Component: SpecialTrainingsBlock', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    initialState = {
      [SliceNameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        specialTrainingList: createTrainingMocks(8)
      },
    };

    store = mockStore(initialState);
  });
  it('should render correctly', () => {

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <SpecialTrainingsBlock userProfile={mockProfileInfo}/>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Специально подобрано для вас/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'previous'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'next'})).toBeInTheDocument();
    expect(screen.getAllByTestId('training-card')).toHaveLength(8);
  });

  it('should change slider offset on "next" or "prev" btn if it is not disabled', async () => {

    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <HistoryRouter history={history}>
          <HelmetProvider>
            <SpecialTrainingsBlock userProfile={mockProfileInfo}/>
          </HelmetProvider>
        </HistoryRouter>
      </Provider>
    );

    const slider = await screen.findByTestId('slider');
    const nextBtn = await screen.findByRole('button', {name: 'next'});
    const prevBtn = await screen.findByRole('button', {name: 'previous'});
    expect(slider).toHaveStyle('transform: translateX(0px)');
    await user.click(nextBtn);
    expect(slider).toHaveStyle('transform: translateX(-472px)');
    await user.click(prevBtn);
    expect(slider).toHaveStyle('transform: translateX(0px)');
    expect(prevBtn).toBeDisabled();
  });
});
