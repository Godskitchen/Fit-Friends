import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from 'src/app-constants';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import LoginPage from 'src/pages/login-page/login.page';
import MainPage from 'src/pages/main-page/main.page';
import QuestionnaireCoachPage from 'src/pages/questionnaire-page/questionnaire-coach.page';
import QuestionnaireUserPage from 'src/pages/questionnaire-page/questionnaire-user.page';
import RegistrationPage from 'src/pages/registration-page/registration.page';
import WelcomePage from 'src/pages/welcome-page/welcome.page';
import LoadingScreen from '../loading-components/loading-screen';
import { checkAuthAction } from 'src/store/api-actions';
import { getAuthCheckedStatus, getAuthorizationStatus } from 'src/store/user-process/user-process.selectors';
import PrivateRoute from '../private-route/private-route';
import NotFoundPage from 'src/pages/not-found-page/not-found.page';
import ForbiddenPage from 'src/pages/forbidden-page/forbidden-page';
import PersonalAccountCoachPage from 'src/pages/personal-account-page/personal-account-coach.page';
import CreateTrainingPage from 'src/pages/create-training-page/create-training.page';
import MyTrainingsPage from '../../pages/my-trainings-page/my-trainings.page';
import TrainingPage from '../../pages/training-page/training-page';
import PersonalAccountUserPage from 'src/pages/personal-account-page/personal-account-user.page';
import UsersCatalogPage from 'src/pages/users-catalog-page/users-catalog-page';
import MyFriendsPage from 'src/pages/my-friends-page/my-friends-page';
import UserPage from 'src/pages/user-page/user-page';
import TrainingsCatalogPage from 'src/pages/trainings-catalog-page/trainings-catalog-page';

export default function App(): JSX.Element {

  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      dispatch(checkAuthAction());
    }

    return () => { isMounted = false; };
  }, [dispatch]);

  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isAuthChecked = useAppSelector(getAuthCheckedStatus);

  if (!isAuthChecked) {
    return <LoadingScreen />;
  }

  //   <Route
  //   path={AppRoute.Add}
  //   element={
  //     <PrivateRoute restrictedFor={AuthorizationStatus.NoAuth} redirectTo={AppRoute.Login}>
  //       <AddOffer />
  //     </PrivateRoute>
  //   }
  // />

  return (
    <HelmetProvider>
      <Routes>
        <Route
          path={AppRoute.Welcome}
          element={<WelcomePage />}
        />
        <Route
          path={AppRoute.Registration}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.Auth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Main}
            >
              <RegistrationPage />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Login}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.Auth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Main}
            >
              <LoginPage />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.QuestionnaireCoach}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.NoAuth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Login}
            >
              <QuestionnaireCoachPage />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.QuestionnaireUser}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.NoAuth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Login}
            >
              <QuestionnaireUserPage />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Main}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.NoAuth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Login}
            >
              <MainPage />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.CoachAccount}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.NoAuth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Login}
            >
              <PersonalAccountCoachPage />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.UserAccount}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.NoAuth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Login}
            >
              <PersonalAccountUserPage />
            </PrivateRoute>
          }
        />
        <Route
          path={`${AppRoute.CoachAccount}${AppRoute.CreateTraining}`}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.NoAuth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Login}
            >
              <CreateTrainingPage />
            </PrivateRoute>
          }
        />
        <Route
          path={`${AppRoute.CoachAccount}${AppRoute.MyTrainings}`}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.NoAuth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Login}
            >
              <MyTrainingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path={`${AppRoute.TrainingsCatalog}/:trainingId`}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.NoAuth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Login}
            >
              <TrainingPage />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.UsersCatalog}
          element={
            <PrivateRoute
              restrictedStatus={AuthorizationStatus.NoAuth}
              currentStatus={authorizationStatus}
              redirectTo={AppRoute.Login}
            >
              <UsersCatalogPage />
            </PrivateRoute>
          }
        />
        <Route
          path={`${AppRoute.UsersCatalog}/:userId`}
          element={<UserPage />}
        />
        <Route
          path={AppRoute.TrainingsCatalog}
          element={<TrainingsCatalogPage />}
        />
        <Route
          path={`${AppRoute.UserAccount}${AppRoute.MyFriends}`}
          element={<MyFriendsPage />}
        />
        <Route
          path={`${AppRoute.CoachAccount}${AppRoute.MyFriends}`}
          element={<MyFriendsPage />}
        />
        <Route
          path={AppRoute.Forbidden}
          element={<ForbiddenPage />}
        />
        <Route
          path='*'
          element={<NotFoundPage />}
        />
      </Routes>
    </HelmetProvider>
  );
}

