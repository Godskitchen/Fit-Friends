import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getNotifications } from 'src/store/user-process/user-process.selectors';
import dayjs from 'dayjs';
import ruLocale from 'dayjs/locale/ru';
import utc from 'dayjs/plugin/utc';
import { deleteNotificationAction } from 'src/store/api-actions';

dayjs.extend(utc);
dayjs.locale(ruLocale);


export default function NotificationsList(): JSX.Element {

  const dispatch = useAppDispatch();
  const [isActive, setIsActive] = useState(false);
  const notifications = useAppSelector(getNotifications);

  const handleMsgClick = (id: string) => {
    dispatch(deleteNotificationAction(id));
  };

  return (
    <li className={`main-nav__item main-nav__item--notifications ${notifications.length > 0 ? 'is-notifications' : ''}`}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <Link className={`main-nav__link ${isActive ? 'is-active' : ''}`} to="#" aria-label="Уведомления">
        <svg width="14" height="18" aria-hidden="true">
          <use xlinkHref="#icon-notification"></use>
        </svg>
      </Link>
      {
        notifications.length > 0
          ? (
            <div className="main-nav__dropdown">
              <p className="main-nav__label">Оповещения</p>
              <ul className="main-nav__sublist">
                {
                  notifications.map(({id, text, createdAt}) => {
                    const date = dayjs(createdAt).local().format('DD MMMM, HH:mm');
                    const attrDate = dayjs(createdAt).local().format('YYYY-MM-DD HH:mm');
                    return (
                      <li className="main-nav__subitem" key={id} onClick={() => handleMsgClick(id)}>
                        <Link className="notification is-active" to="#">
                          <p className="notification__text">{text}</p>
                          <time className="notification__time" dateTime={attrDate}>{date}</time>
                        </Link>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          )
          : ''
      }
    </li>
  );
}

// <li className="main-nav__subitem">
//   <Link className="notification is-active" to="#">
//     <p className="notification__text">Никита отклонил приглашение на&nbsp;совместную тренировку</p>
//     <time className="notification__time" dateTime="2023-12-22 09:22">22 декабря, 09:22</time>
//   </Link>
// </li>
// <li className="main-nav__subitem">
//   <Link className="notification is-active" to="#">
//     <p className="notification__text">Татьяна добавила вас в&nbsp;друзья</p>
//     <time className="notification__time" dateTime="2023-12-18 18:50">18 декабря, 18:50</time>
//   </Link>
// </li>
