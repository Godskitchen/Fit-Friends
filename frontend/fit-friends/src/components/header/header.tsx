import { Link } from 'react-router-dom';
import { HeaderNavTab } from 'src/types/constants';

type HeaderProps = {
  activeTab: HeaderNavTab;
}
export default function Header({activeTab}: HeaderProps) {
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
            <li className="main-nav__item main-nav__item--notifications">
              <Link className="main-nav__link" to="#" aria-label="Уведомления">
                <svg width="14" height="18" aria-hidden="true">
                  <use xlinkHref="#icon-notification"></use>
                </svg>
              </Link>
              <div className="main-nav__dropdown">
                <p className="main-nav__label">Оповещения</p>
                <ul className="main-nav__sublist">
                  <li className="main-nav__subitem">
                    <Link className="notification is-active" to="#">
                      <p className="notification__text">Катерина пригласила вас на&nbsp;тренировку</p>
                      <time className="notification__time" dateTime="2023-12-23 12:35">23 декабря, 12:35</time>
                    </Link>
                  </li>
                  <li className="main-nav__subitem">
                    <Link className="notification is-active" to="#">
                      <p className="notification__text">Никита отклонил приглашение на&nbsp;совместную тренировку</p>
                      <time className="notification__time" dateTime="2023-12-22 09:22">22 декабря, 09:22</time>
                    </Link>
                  </li>
                  <li className="main-nav__subitem">
                    <Link className="notification is-active" to="#">
                      <p className="notification__text">Татьяна добавила вас в&nbsp;друзья</p>
                      <time className="notification__time" dateTime="2023-12-18 18:50">18 декабря, 18:50</time>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
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
