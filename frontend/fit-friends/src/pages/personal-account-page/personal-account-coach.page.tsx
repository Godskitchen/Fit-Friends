import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import CertificateSlider from 'src/components/certificate-slider/certificate-slider';
import ErrorScreen from 'src/components/error-screen/error-screen';
import Header from 'src/components/header/header';
import LoadingBlock from 'src/components/loading-components/loading-block';
import UserInfoDesk from 'src/components/user-info-desk/user-info-desk';
import { useAppSelector } from 'src/hooks';
import { getMyProfileInfo } from 'src/store/user-process/user-process.selectors';
import { HeaderNavTab, Role } from 'src/types/constants';

export default function PersonalAccountCoachPage() : JSX.Element {

  const navigate = useNavigate();
  const myProfile = useAppSelector(getMyProfileInfo);

  useEffect(() => {
    if (myProfile) {
      if (myProfile.role === Role.Trainer && !myProfile.trainerProfile) {
        navigate(AppRoute.QuestionnaireCoach, {replace: true});
      } else if (myProfile.role === Role.User && !myProfile.userProfile) {
        navigate(AppRoute.QuestionnaireUser, {replace: true});
      } else if (myProfile.role === Role.User) {
        navigate(AppRoute.Forbidden, {replace: true});
      }
    }
  }, [myProfile, navigate]);

  if (myProfile === undefined) {
    return <LoadingBlock />;
  }

  if (myProfile === null) {
    return <ErrorScreen />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>Личный кабинет — FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Home} />
        <main>
          <section className="inner-page">
            <div className="container">
              <div className="inner-page__wrapper">
                <h1 className="visually-hidden">Личный кабинет</h1>
                <UserInfoDesk myProfile={myProfile} />
                <div className="inner-page__content">
                  <div className="personal-account-coach">
                    <div className="personal-account-coach__navigation">
                      <Link className="thumbnail-link thumbnail-link--theme-light" to={`${AppRoute.CoachAccount}${AppRoute.MyTrainings}`}>
                        <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                          <svg width="30" height="26" aria-hidden="true">
                            <use xlinkHref="#icon-flash"></use>
                          </svg>
                        </div>
                        <span className="thumbnail-link__text">Мои тренировки</span>
                      </Link>
                      <Link className="thumbnail-link thumbnail-link--theme-light" to={`${AppRoute.CoachAccount}${AppRoute.CreateTraining}`}>
                        <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                          <svg width="30" height="26" aria-hidden="true">
                            <use xlinkHref="#icon-add"></use>
                          </svg>
                        </div>
                        <span className="thumbnail-link__text">Создать тренировку</span>
                      </Link>
                      <Link className="thumbnail-link thumbnail-link--theme-light" to={`${AppRoute.CoachAccount}${AppRoute.MyFriends}`}>
                        <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                          <svg width="30" height="26" aria-hidden="true">
                            <use xlinkHref="#icon-friends"></use>
                          </svg>
                        </div>
                        <span className="thumbnail-link__text">Мои друзья</span>
                      </Link>
                      <Link className="thumbnail-link thumbnail-link--theme-light" to={`${AppRoute.CoachAccount}${AppRoute.MyOrders}`}>
                        <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                          <svg width="30" height="26" aria-hidden="true">
                            <use xlinkHref="#icon-bag"></use>
                          </svg>
                        </div>
                        <span className="thumbnail-link__text">Мои заказы</span>
                      </Link>
                      <div className="personal-account-coach__calendar">
                        <div className="thumbnail-spec-gym">
                          <div className="thumbnail-spec-gym__image">
                            <picture>
                              <source type="image/webp" srcSet="/img/content/thumbnails/nearest-gym-01.webp, /img/content/thumbnails/nearest-gym-01@2x.webp 2x" />
                              <img src="/img/content/thumbnails/nearest-gym-01.jpg" srcSet="/img/content/thumbnails/nearest-gym-01@2x.jpg 2x" width="330" height="190" alt="" />
                            </picture>
                          </div>
                          <div className="thumbnail-spec-gym__header">
                            <h3 className="thumbnail-spec-gym__title">Скоро тут будет интересно</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CertificateSlider />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Fragment>
  );
}
