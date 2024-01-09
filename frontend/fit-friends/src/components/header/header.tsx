import { Link } from 'react-router-dom';
import { HeaderNavTab, Role } from 'src/types/constants';
import NotificationsList from '../notifications-list/notifications-list';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { useEffect } from 'react';
import { getNotificationsAction } from 'src/store/api-actions';
import { AppRoute } from 'src/app-constants';
import { getMyProfileInfo } from 'src/store/user-process/user-process.selectors';
import LoadingBlock from '../loading-components/loading-block';

const DISPATCH_INTERVAL = 30000;

type HeaderProps = {
  activeTab: HeaderNavTab;
}

export default function Header({activeTab}: HeaderProps) {

  const dispatch = useAppDispatch();
  const myProfile = useAppSelector(getMyProfileInfo);

  useEffect(() => {
    dispatch(getNotificationsAction());
    const intervalId = setInterval(
      () => {dispatch(getNotificationsAction());},
      DISPATCH_INTERVAL
    );
    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (!myProfile) {
    return <LoadingBlock />;
  }

  return (
    <header className="header">
      <div className="container">
        <Link className="header__logo" to={AppRoute.Main} aria-label="Переход на главную">
          <svg width="187" height="70" aria-hidden="true">
            <use xlinkHref="#logo"></use>
          </svg>
        </Link>
        <nav className="main-nav">
          <ul className="main-nav__list">
            <li className="main-nav__item">
              <Link className={`main-nav__link ${activeTab === HeaderNavTab.Home ? 'is-active' : ''}`}
                to={myProfile.role === Role.User ? AppRoute.Main : AppRoute.CoachAccount}
                aria-label="На главную"
                data-testid="main"
              >
                <svg width="18" height="18" aria-hidden="true">
                  <use xlinkHref="#icon-home"></use>
                </svg>
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className={`main-nav__link ${activeTab === HeaderNavTab.Profile ? 'is-active' : ''}`}
                to={myProfile.role === Role.User ? AppRoute.UserAccount : AppRoute.CoachAccount}
                aria-label="Личный кабинет"
                data-testid="profile"
              >
                <svg width="16" height="18" aria-hidden="true">
                  <use xlinkHref="#icon-user"></use>
                </svg>
              </Link>
            </li>
            <li className="main-nav__item">
              <Link
                className={`main-nav__link ${activeTab === HeaderNavTab.Friends ? 'is-active' : ''}`}
                to={myProfile.role === Role.User ? `${AppRoute.UserAccount}${AppRoute.MyFriends}` : `${AppRoute.CoachAccount}${AppRoute.MyFriends}`}
                aria-label="Друзья"
                data-testid="friends"
              >
                <svg width="22" height="16" aria-hidden="true">
                  <use xlinkHref="#icon-friends"></use>
                </svg>
              </Link>
            </li>
            <NotificationsList />
          </ul>
        </nav>
        <div className="search">
          <form action="#" method="get">
            <label>
              <span className="search__label">Поиск</span>
              <input type="search" name="search" disabled />
              <svg className="search__icon" width="20" height="20" aria-hidden="true">
                <use xlinkHref="#icon-search"></use>
              </svg>
            </label>
            <ul className="search__list">
            </ul>
          </form>
        </div>
      </div>
    </header>
  );
}
