import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from 'src/components/header/header';
import LoadingBlock from 'src/components/loading-components/loading-block';
import UserInfoDesk from 'src/components/user-info-desk/user-info-desk';
import { useAppSelector } from 'src/hooks';
import { getUserInfo } from 'src/store/user-process/user-process.selectors';
import { HeaderNavTab } from 'src/types/constants';
import { formatNumber } from 'src/utils/helpers';

export default function PersonalAccountUserPage() : JSX.Element {
  const userInfo = useAppSelector(getUserInfo);

  if (!userInfo || !userInfo.userProfile) {
    return <LoadingBlock />;
  }

  const formatedCaloriesForDay = formatNumber(userInfo.userProfile.caloriesToBurn);
  const formatedCaloriesForWeek = formatNumber(userInfo.userProfile.caloriesToBurn * 7);

  return (
    <Fragment>
      <Helmet>
        <title>Личный кабинет — FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Profile} />
        <main>
          <section className="inner-page">
            <div className="container">
              <div className="inner-page__wrapper">
                <h1 className="visually-hidden">Личный кабинет</h1>
                <UserInfoDesk />
                <div className="inner-page__content">
                  <div className="personal-account-user">
                    <div className="personal-account-user__schedule">
                      <form action="#" method="get">
                        <div className="personal-account-user__form">
                          <div className="personal-account-user__input">
                            <label>
                              <span className="personal-account-user__label">План на день, ккал</span>
                              <input type="text" name="schedule-for-the-day" value={formatedCaloriesForDay} disabled readOnly />
                            </label>
                          </div>
                          <div className="personal-account-user__input">
                            <label>
                              <span className="personal-account-user__label">План на неделю, ккал</span>
                              <input type="text" name="schedule-for-the-week" value={formatedCaloriesForWeek} disabled readOnly />
                            </label>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="personal-account-user__additional-info">
                      <Link className="thumbnail-link thumbnail-link--theme-light" to="#">
                        <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                          <svg width="30" height="26" aria-hidden="true">
                            <use xlinkHref="#icon-friends"></use>
                          </svg>
                        </div>
                        <span className="thumbnail-link__text">Мои друзья</span>
                      </Link>
                      <Link className="thumbnail-link thumbnail-link--theme-light" to="#">
                        <div className="thumbnail-link__icon thumbnail-link__icon--theme-light">
                          <svg width="30" height="26" aria-hidden="true">
                            <use xlinkHref="#icon-shopping-cart"></use>
                          </svg>
                        </div>
                        <span className="thumbnail-link__text">Мои покупки</span>
                      </Link>
                      <div className="thumbnail-spec-gym">
                        <div className="thumbnail-spec-gym__image">
                          <picture>
                            <source type="image/webp" srcSet="img/content/thumbnails/nearest-gym-01.webp, img/content/thumbnails/nearest-gym-01@2x.webp 2x" />
                            <img src="img/content/thumbnails/nearest-gym-01.jpg" srcSet="img/content/thumbnails/nearest-gym-01@2x.jpg 2x" width="330" height="190" alt="" />
                          </picture>
                        </div>
                        <div className="thumbnail-spec-gym__header">
                          <h3 className="thumbnail-spec-gym__title">Скоро тут появится что-то полезное</h3>
                        </div>
                      </div>
                    </div>
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
