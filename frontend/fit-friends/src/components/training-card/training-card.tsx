import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { SpecialisationHashTagValue } from 'src/types/constants';
import { TrainingCardType } from 'src/types/training.type';

type TrainingCardProp = {
  card: TrainingCardType;
  className: string;
}

export default function TrainingCard({card:{
  trainingId,
  title,
  specialisation,
  description,
  price,
  backgroundImage,
  rating,
  caloriesToBurn
}, className}: TrainingCardProp): JSX.Element {

  return (
    <li className={className}>
      <div className="thumbnail-training">
        <div className="thumbnail-training__inner">
          <div className="thumbnail-training__image">
            <picture>
              <img
                src={backgroundImage}
                width="330" height="190"
                alt=""
              />
            </picture>
          </div>
          <p className="thumbnail-training__price">
            {
              price !== 0 ? (
                <Fragment>
                  <span className="thumbnail-training__price-value">{price}</span>
                  <span>₽</span>
                </Fragment>
              ) : 'Бесплатно'
            }
          </p>
          <h3 className="thumbnail-training__title">{title}</h3>
          <div className="thumbnail-training__info">
            <ul className="thumbnail-training__hashtags-list">
              <li className="thumbnail-training__hashtags-item">
                <div className="hashtag thumbnail-training__hashtag">
                  <span>{SpecialisationHashTagValue[specialisation]}</span>
                </div>
              </li>
              <li className="thumbnail-training__hashtags-item">
                <div className="hashtag thumbnail-training__hashtag">
                  <span>{`#${caloriesToBurn}ккал`}</span>
                </div>
              </li>
            </ul>
            <div className="thumbnail-training__rate">
              <svg width="16" height="16" aria-hidden="true">
                <use xlinkHref="#icon-star"></use>
              </svg>
              <span className="thumbnail-training__rate-value">{rating.toFixed()}</span>
            </div>
          </div>
          <div className="thumbnail-training__text-wrapper">
            <p className="thumbnail-training__text">
              {description}
            </p>
          </div>
          <div className="thumbnail-training__button-wrapper">
            <Link className="btn btn--small thumbnail-training__button-catalog" to={`${AppRoute.TrainingsCatalog}/${trainingId}`}>Подробнее</Link>
            <Link className="btn btn--small btn--outlined thumbnail-training__button-catalog" to="#">Отзывы</Link>
          </div>
        </div>
      </div>
    </li>
  );
}
