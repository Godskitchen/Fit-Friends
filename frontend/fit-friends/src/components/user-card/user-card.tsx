import { Link } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { Role, Specialisation, Location, SpecialisationHashTagValue } from 'src/types/constants';

type UserCardProps = {
  userId: number;
  name: string;
  avatar: string;
  location: Location;
  specialisations: Specialisation[];
  role: Role;
}

export default function UserCard({userId, name, avatar, location, specialisations, role}: UserCardProps): JSX.Element {
  return (
    <li className="users-catalog__item">
      <div className={`thumbnail-user thumbnail-user--role-${role === Role.User ? 'user' : 'coach'}`}>
        <div className="thumbnail-user__image">
          <picture>
            <img src={avatar} width="82" height="82" alt=""/>
          </picture>
        </div>
        <div className="thumbnail-user__header">
          <h3 className="thumbnail-user__name">{name}</h3>
          <div className="thumbnail-user__location">
            <svg width="14" height="16" aria-hidden="true">
              <use xlinkHref="#icon-location"></use>
            </svg>
            <address className="thumbnail-user__location-address">{location}</address>
          </div>
        </div>
        <ul className="thumbnail-user__hashtags-list">
          {
            specialisations.map((spec) => (
              <li className="thumbnail-user__hashtags-item" key={spec}>
                <div className="hashtag thumbnail-user__hashtag">
                  <span>{SpecialisationHashTagValue[spec]}</span>
                </div>
              </li>
            ))
          }
        </ul>
        <Link
          className="btn btn--medium thumbnail-user__button"
          to={`${AppRoute.UsersCatalog}/${userId}`}
        >
            Подробнее
        </Link>
      </div>
    </li>
  );
}
