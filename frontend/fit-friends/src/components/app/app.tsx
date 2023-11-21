import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { useAppDispatch } from 'src/hooks';
import LoginPage from 'src/pages/login-page/login.page';
import MainPage from 'src/pages/main-page/main.page';
import QuestionnaireCoachPage from 'src/pages/questionnaire-page/questionnaire-coach.page';
import QuestionnaireUserPage from 'src/pages/questionnaire-page/questionnaire-user.page';
import RegistrationPage from 'src/pages/registration-page/registration.page';
import WelcomePage from 'src/pages/welcome-page/welcome.page';
// import LoadingScreen from '../loading-screen/loading-screen';
import { checkAuthAction } from 'src/store/api-actions';

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
  // const isAuthChecked = useAppSelector(getAuthCheckedStatus);

  // if (!isAuthChecked) {
  //   return <LoadingScreen />;
  // }

  return (
    <HelmetProvider>
      <Routes>
        <Route
          path={AppRoute.Welcome}
          element={<WelcomePage />}
        />
        <Route
          path={AppRoute.Registration}
          element={<RegistrationPage />}
        />
        <Route
          path={AppRoute.QuestionnaireCoach}
          element={<QuestionnaireCoachPage />}
        />
        <Route
          path={AppRoute.QuestionnaireUser}
          element={<QuestionnaireUserPage />}
        />
        <Route
          path={AppRoute.Login}
          element={<LoginPage />}
        />
        <Route
          path={AppRoute.Main}
          element={<MainPage />}
        />
      </Routes>
    </HelmetProvider>
  );
}
