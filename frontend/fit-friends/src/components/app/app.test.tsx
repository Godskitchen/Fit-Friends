/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen } from '@testing-library/react';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Provider } from 'react-redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { createBrowserHistory } from 'history';
import HistoryRouter from '../history-router/history-router';
import Router from 'react-router';
import App from './app';
import { HttpStatusCode, createAPI } from 'src/services/server-api';
import { State } from 'src/types/state.type';
import { AppRoute, AuthorizationStatus, SliceNameSpace } from 'src/app-constants';
import { MockTrainer, MockTrainerProfile, MockUser, MockUserProfile, createTrainingMocks, createUserMocks } from 'src/mock-constants';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];

const mockId = 10;
const mockStore = configureMockStore<
  State,
  Action<string>,
  ThunkDispatch<State, typeof api, Action>
>(middlewares);

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
} as object));

jest.mock('src/utils/pdf-thumbnailer',
  () => (_cert: string) => 'http://localhost:4000/static/users/backs/user-3.png'
);

jest.mock('nanoid', () => ({
  customAlphabet: (_alphabet: string, _defaultSize?: number) => {
    let idCounter = 1;
    return () => idCounter++;
  }})
);

const history = createBrowserHistory();

// const fakeApp = (
//   <Provider store={store}>
//     <HistoryRouter history={history}>
//       <App />
//     </HistoryRouter>
//   </Provider>
// );


describe('Application routing', () => {
  let store: ReturnType<typeof mockStore>;
  let initialState;

  beforeEach(() => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: `${mockId}` });
  });

  describe('Main Page route', () => {
    it('should render "MainPage" when user with role user and filled profile navigate to "/main"', () => {
      history.push(AppRoute.Main);

      initialState = {
        [SliceNameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          myProfileInfo: {...MockUser, userProfile: MockUserProfile },
          specialTrainingList: createTrainingMocks(8),
          notifications: []
        },
        [SliceNameSpace.Data]: {
          dataUploadingStatus: false,
          trainingsDownloadingStatus: false,
          trainingList: createTrainingMocks(4),
          readyUsersList: createUserMocks(7),
          specialOffersList: createTrainingMocks(3),
          totalTrainingsCount: 4,
          loadingError: ''
        }
      };

      store = mockStore(initialState);

      render(
        <Provider store={store}>
          <HistoryRouter history={history}>
            <App />
          </HistoryRouter>
        </Provider>
      );

      expect(screen.getByText(/Специально подобрано для вас/i)).toBeInTheDocument();
      expect(screen.getByText(/Специальные предложения/i)).toBeInTheDocument();
      expect(screen.getByText(/Популярные тренировки/i)).toBeInTheDocument();
      expect(screen.getByText(/Ищут компанию для тренировки/i)).toBeInTheDocument();
    });

    it('should render "Coach Account Page" when user with role "Coach" and filled profile navigate to "/main"', () => {
      history.push(AppRoute.Main);

      initialState = {
        [SliceNameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
          notifications: []
        },
        [SliceNameSpace.Data]: {
          dataUploadingStatus: false,
        }
      };

      store = mockStore(initialState);

      render(
        <Provider store={store}>
          <HistoryRouter history={history}>
            <App />
          </HistoryRouter>
        </Provider>
      );

      expect(screen.getByText(/Личный кабинет/i)).toBeInTheDocument();
      expect(screen.getByText(/Обо мне/i)).toBeInTheDocument();
      expect(screen.getByText(/Мои тренировки/i)).toBeInTheDocument();
    });


    it('should render "Questinnaire Coach Page" when user with role "Coach" and no filled profile navigate to "/main"', () => {
      history.push(AppRoute.Main);

      initialState = {
        [SliceNameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          myProfileInfo: {...MockTrainer },
        },
        [SliceNameSpace.Data]: {
          dataUploadingStatus: false,
        }
      };

      store = mockStore(initialState);

      render(
        <Provider store={store}>
          <HistoryRouter history={history}>
            <App />
          </HistoryRouter>
        </Provider>
      );

      expect(screen.getByText(/Опросник/i)).toBeInTheDocument();
      expect(screen.getByText(/Ваши дипломы и сертификаты/i)).toBeInTheDocument();
    });

    it('should render "Questinnaire User Page" when user with role "User" and no filled profile navigate to "/main"', () => {
      history.push(AppRoute.Main);

      initialState = {
        [SliceNameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          myProfileInfo: {...MockUser },
        },
        [SliceNameSpace.Data]: {
          dataUploadingStatus: false,
        }
      };

      store = mockStore(initialState);

      render(
        <Provider store={store}>
          <HistoryRouter history={history}>
            <App />
          </HistoryRouter>
        </Provider>
      );

      expect(screen.getByText(/Опросник/i)).toBeInTheDocument();
      expect(screen.getByText(/Сколько калорий тратить в день/i)).toBeInTheDocument();
    });

    it('should render "Login Page" when unauthorized user navigate to "/main"', () => {
      history.push(AppRoute.Main);

      initialState = {
        [SliceNameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          myProfileInfo: null,
          formErrors: {
            [HttpStatusCode.UNAUTHORIZED]: ''
          }
        },
        [SliceNameSpace.Data]: {
          dataUploadingStatus: false,
          loadingError: '',
        }
      };

      store = mockStore(initialState);

      render(
        <Provider store={store}>
          <HistoryRouter history={history}>
            <App />
          </HistoryRouter>
        </Provider>
      );

      expect(screen.getByText(/Вход/i)).toBeInTheDocument();
      expect(screen.getByText(/E-mail/i)).toBeInTheDocument();
      expect(screen.getByText(/Пароль/i)).toBeInTheDocument();
    });
  });

  describe('Forbidden routing', () => {
    it('should render "Forbidden Page" when user with role "Sportsman" navigate to "/create_training"', () => {
      history.push(`${AppRoute.CoachAccount}${AppRoute.CreateTraining}`);

      initialState = {
        [SliceNameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          myProfileInfo: {...MockUser, userProfile: MockUserProfile },
        },
        [SliceNameSpace.Data]: {
          loadingError: '',
        }
      };

      store = mockStore(initialState);

      render(
        <Provider store={store}>
          <HistoryRouter history={history}>
            <App />
          </HistoryRouter>
        </Provider>
      );

      expect(screen.getByText('Данная страница для вас недоступна')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('На главную');
    });

    it('should render "Forbidden Page" when user with role "Coach" navigate to "/my_purchases"', () => {
      history.push(`${AppRoute.UserAccount}${AppRoute.MyPurchases}`);

      initialState = {
        [SliceNameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
          notifications: []
        },
        [SliceNameSpace.Data]: {
          loadingError: '',
        }
      };

      store = mockStore(initialState);

      render(
        <Provider store={store}>
          <HistoryRouter history={history}>
            <App />
          </HistoryRouter>
        </Provider>
      );

      expect(screen.getByText('Данная страница для вас недоступна')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('На главную');
    });
  });

  describe('NotFoundPage routing', () => {
    it('should render "NotFoundPage" when user navigate to non-existent route', () => {
      history.push('/non-existent-route');

      initialState = {
        [SliceNameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          myProfileInfo: {...MockTrainer, trainerProfile: MockTrainerProfile },
          notifications: []
        },
        [SliceNameSpace.Data]: {
          loadingError: '',
        }
      };

      store = mockStore(initialState);

      render(
        <Provider store={store}>
          <HistoryRouter history={history}>
            <App />
          </HistoryRouter>
        </Provider>
      );

      expect(screen.getByText('Запрашиваемая страница не найдена')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('На главную');
    });
  });
});

// it('should render "MyListPage" when user navigate to "/mylist"', () => {
//   history.push(AppRoute.MyList);

//   render(fakeApp);

//   expect(screen.getByText('My list')).toBeInTheDocument();
//   expect(screen.getByTestId('films-count')).toHaveTextContent(`${0}`);
// });

// it('should redirect to main page when user navigate to "/films"', () => {
//   history.push('/films');

//   render(fakeApp);

//   expect(screen.getByTestId('bg-image')).toHaveAttribute('src', promo.backgroundImage);
//   expect(screen.getByAltText(`${promo.name} poster`)).toHaveAttribute('src', promo.posterImage);
//   expect(screen.getByTestId('title')).toHaveTextContent(promo.name);
//   expect(screen.getByTestId('genre')).toHaveTextContent(promo.genre);
//   expect(screen.getByTestId('year')).toHaveTextContent(`${promo.released}`);
// });

// it('should render movie page with "overview" active tab when user navigate to "/films/:id/overview"', () => {
//   history.push(`/films/${mockId}/overview`);

//   render(fakeApp);

//   expect(screen.getByTestId('moviepage-bgimage')).toHaveAttribute('src', film.backgroundImage);
//   expect(screen.getByAltText(`${film.name} poster`)).toHaveAttribute('src', film.posterImage);
//   expect(screen.getByTestId('moviepage-title')).toHaveTextContent(film.name);
//   expect(screen.getByTestId('moviepage-genre')).toHaveTextContent(film.genre);
//   expect(screen.getByTestId('moviepage-year')).toHaveTextContent(`${film.released}`);
// });

// it('should render movie page with "details" active tab when user navigate to "/films/:id/details"', () => {
//   history.push(`/films/${mockId}/details`);

//   render(fakeApp);

//   expect(screen.getByTestId('details-runtime')).toHaveTextContent('Run Time');
//   expect(screen.getByTestId('details-director')).toHaveTextContent(film.director);
//   expect(screen.getByTestId('details-starring')).toHaveTextContent('Starring');
//   expect(screen.getByTestId('details-genre')).toHaveTextContent(film.genre);
//   expect(screen.getByTestId('details-year')).toHaveTextContent(`${film.released}`);
// });

// it('should render movie page with "reviews" active tab when user navigate to "/films/:id/reviews"', () => {
//   history.push(`/films/${mockId}/reviews`);

//   render(fakeApp);

//   expect(screen.getByTestId('reviews-list')).toBeInTheDocument();
//   expect(screen.getAllByTestId('review').length).toEqual(reviews.length);
// });
// it('should render add review page when user navigate to "/films/:id/review"', () => {
//   history.push(`/films/${mockId}/review`);

//   render(fakeApp);

//   expect(screen.getByTestId('rating')).toBeInTheDocument();
//   expect(screen.getByPlaceholderText(/Review text/i)).toBeInTheDocument();

//   expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument();
// });

// it('should render player page when user navigate to "/player/:id/"', () => {
//   history.push(`/player/${mockId}`);

//   render(fakeApp);

//   const videoElement = screen.getByTestId('video-element');
//   expect(videoElement).toHaveAttribute('src', film.videoLink);
//   expect(videoElement).toHaveAttribute('poster', film.backgroundImage);
// });

// it('should render "NotFoundPage" when user navigate to non-existent route', () => {
//   history.push('/non-existent-route');

//   render(fakeApp);

//   expect(screen.getByText('Page Not Found')).toBeInTheDocument();
// expect(screen.getByRole('button')).toHaveTextContent('Вернуться на главную');
