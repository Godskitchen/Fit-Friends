import { Link } from 'react-router-dom';
import { HeaderNavTab } from 'src/types/constants';
import NotificationsList from '../notifications-list/notifications-list';
import { useAppDispatch } from 'src/hooks';
import { useEffect } from 'react';
import { getNotificationsAction } from 'src/store/api-actions';


type HeaderProps = {
  activeTab: HeaderNavTab;
}
export default function Header({activeTab}: HeaderProps) {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getNotificationsAction());
    const intervalId = setInterval(() => {dispatch(getNotificationsAction());}, 30000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <header className="header">
      <div className="container">
        <a className="header__logo" href="index.html" aria-label="Переход на главную">
          <svg width="187" height="70" aria-hidden="true">
            <use xlinkHref="#logo"></use>
          </svg>
        </a>
        <nav className="main-nav">
          <ul className="main-nav__list">
            <li className="main-nav__item">
              <Link className={`main-nav__link ${activeTab === HeaderNavTab.Home ? 'is-active' : ''}`} to="#" aria-label="На главную">
                <svg width="18" height="18" aria-hidden="true">
                  <use xlinkHref="#icon-home"></use>
                </svg>
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className={`main-nav__link ${activeTab === HeaderNavTab.Profile ? 'is-active' : ''}`} to="#" aria-label="Личный кабинет">
                <svg width="16" height="18" aria-hidden="true">
                  <use xlinkHref="#icon-user"></use>
                </svg>
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className={`main-nav__link ${activeTab === HeaderNavTab.Friends ? 'is-active' : ''}`} to="#" aria-label="Друзья">
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
