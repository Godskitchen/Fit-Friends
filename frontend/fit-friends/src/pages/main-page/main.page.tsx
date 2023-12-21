import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from 'src/components/header/header';
import LoadingScreen from 'src/components/loading-components/loading-screen';
import LookForCompanyBlock from 'src/components/look-for-company-block/look-for-company-block';
import OffersBlock from 'src/components/offers-block/offers-block';
import PopularTrainingsBlock from 'src/components/trainings-block/popular-trainings-block';
import SpecialTrainingsBlock from 'src/components/trainings-block/special-trainings-block';
import { useAppSelector } from 'src/hooks';
import { getMyProfileInfo } from 'src/store/user-process/user-process.selectors';
import { HeaderNavTab } from 'src/types/constants';

export default function MainPage(): JSX.Element {

  const myProfile = useAppSelector(getMyProfileInfo);

  if (myProfile === undefined || !myProfile?.userProfile) {
    return <LoadingScreen />;
  }

  if (myProfile === null) {
    return <p>error</p>;
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
