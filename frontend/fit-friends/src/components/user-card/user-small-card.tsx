import { Link } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { Specialisation, SpecialisationHashTagValue } from 'src/types/constants';
import { UserInfo } from 'src/types/user.type';

type UserSmallCardProps = {
  card: UserInfo;
}
export default function UserSmallCard({card: {userId, name, location, userProfile, avatar}}: UserSmallCardProps): JSX.Element {

  const specialisations = userProfile?.specialisations as Specialisation[];

  return (
    <li className="look-for-company__item">
      <div className="thumbnail-user thumbnail-user--role-user thumbnail-user--dark">
        <div className="thumbnail-user__image">
          <picture>
            <img src={avatar} width="82" height="82" alt="avatar" />
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
              <li key={spec} className='thumbnail-user__hashtags-item'>
                <div className="hashtag thumbnail-user__hashtag">
                  <span>{SpecialisationHashTagValue[spec]}</span>
                </div>
              </li>
            ))
          }
        </ul>
        <Link
          className="btn btn--outlined btn--dark-bg btn--medium thumbnail-user__button"
          to={`${AppRoute.UsersCatalog}/${userId}`}
        >
            Подробнее
        </Link>
      </div>
    </li>
  );
}
