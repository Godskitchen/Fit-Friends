import { HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import { AppRoute } from 'src/const';
import LoginPage from 'src/pages/login-page/login.page';
import MainPage from 'src/pages/main-page/main.page';
import QuestionnaireCoachPage from 'src/pages/questionnaire-page/questionnaire-coach.page';
import QuestionnaireUserPage from 'src/pages/questionnaire-page/questionnaire-user.page';
import RegistrationPage from 'src/pages/registration-page/registration.page';
import WelcomePage from 'src/pages/welcome-page/welcome.page';

export default function App(): JSX.Element {
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
