import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import LoginPage from 'src/pages/login-page/login.page';
import MainPage from 'src/pages/main-page/main.page';
import QuestionnaireCoachPage from 'src/pages/questionnaire-page/questionnaire-coach.page';
import QuestionnaireUserPage from 'src/pages/questionnaire-page/questionnaire-user.page';
import RegistrationPage from 'src/pages/registration-page/registration.page';
import WelcomePage from 'src/pages/welcome-page/welcome.page';
import LoadingScreen from '../loading-screen/loading-screen';
import { checkAuthAction } from 'src/store/api-actions';
import { getAuthCheckedStatus } from 'src/store/user-process/user-process.selectors';
// import PrivateRoute from '../private-route/private-route';
// import PublicRoute from '../public-route/public-route';
import NotFoundPage from 'src/pages/not-found-page/not-found.page';
import ForbiddenPage from 'src/pages/forbidden-page/forbidden-page';
import PersonalAccountCoachPage from 'src/pages/personal-account/personal-account-coach.page';
import QuestionnaireCoachPageTest from 'src/pages/questionnaire-page/questionnaire-coach.page-test';

export default function App(): JSX.Element {

  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      dispatch(checkAuthAction());
    }

    return () => { isMounted = false; };
  }, [dispatch]);

  // const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isAuthChecked = useAppSelector(getAuthCheckedStatus);

  if (!isAuthChecked) {
    return <LoadingScreen />;
  }

  return (
    <HelmetProvider>
      <Routes>
        <Route
          path={AppRoute.Test}
          element={<QuestionnaireCoachPageTest />}
        />
        <Route
          path={AppRoute.Welcome}
          element={<WelcomePage />}
        />
        <Route
          path={AppRoute.Registration}
          element=
            {
              <RegistrationPage />
            }
        />
        <Route
          path={AppRoute.QuestionnaireCoach}
          element=
            {
              <QuestionnaireCoachPage />
            }
        />
        <Route
          path={AppRoute.QuestionnaireUser}
          element=
            {
              <QuestionnaireUserPage />
            }
        />
        <Route
          path={AppRoute.Login}
          element={<LoginPage />}
        />
        <Route
          path={AppRoute.Main}
          element= {<MainPage />}
        />
        <Route
          path={AppRoute.CoachAccount}
          element={<PersonalAccountCoachPage />}
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

