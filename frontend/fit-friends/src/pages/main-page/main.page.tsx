import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import ErrorScreen from 'src/components/error-components/error-screen';
import Header from 'src/components/header/header';
import LoadingScreen from 'src/components/loading-components/loading-screen';
import LookForCompanyBlock from 'src/components/look-for-company-block/look-for-company-block';
import OffersBlock from 'src/components/offers-block/offers-block';
import PopularTrainingsBlock from 'src/components/trainings-block/popular-trainings-block';
import SpecialTrainingsBlock from 'src/components/trainings-block/special-trainings-block';
import { useAppSelector } from 'src/hooks';
import { getMyProfileInfo } from 'src/store/user-process/user-process.selectors';
import { HeaderNavTab, Role } from 'src/types/constants';

export default function MainPage(): JSX.Element | null {

  const myProfile = useAppSelector(getMyProfileInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (myProfile) {
      if (myProfile.role === Role.Trainer && !myProfile.trainerProfile) {
        navigate(AppRoute.QuestionnaireCoach, {replace: true});
      } else if (myProfile.role === Role.User && !myProfile.userProfile) {
        navigate(AppRoute.QuestionnaireUser, {replace: true});

      } else if (myProfile.role === Role.Trainer) {
        navigate(AppRoute.CoachAccount, {replace: true});

      }
    }
  }, [myProfile, navigate]);


  if (myProfile === null) {
    return <ErrorScreen />;
  }

  if (myProfile === undefined || myProfile.userProfile === undefined) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Home} />
        <main>
          <h1 className="visually-hidden">FitFriends — Время находить тренировки, спортзалы и друзей спортсменов</h1>
          <SpecialTrainingsBlock userProfile={myProfile.userProfile} />
          <OffersBlock />
          <PopularTrainingsBlock />
          <LookForCompanyBlock />
        </main>
      </div>
    </Fragment>
  );
}
