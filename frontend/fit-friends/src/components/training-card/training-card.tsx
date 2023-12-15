import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { SpecialisationHashTagValue } from 'src/types/constants';
import { MyTraining } from 'src/types/training.type';

type TrainingCardProp = {
  card: MyTraining;
}

export default function TrainingCard({card:{
  trainingId,
  title,
  specialisation,
  description,
  price,
  isSpecialOffer,
  backgroundImage,
  rating,
  caloriesToBurn
}}: TrainingCardProp): JSX.Element {

  let currentPrice = price;
  if (isSpecialOffer) {
    currentPrice = Number((price * 0.1).toFixed());
  }

  return (
    <li className="my-trainings__item">
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
              currentPrice !== 0 ? (
                <Fragment>
                  <span className="thumbnail-training__price-value">{currentPrice}</span>
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
            <Link className="btn btn--small thumbnail-training__button-catalog" to={`${AppRoute.CoachAccount}${AppRoute.MyTrainings}/${trainingId}`}>Подробнее</Link>
            <Link className="btn btn--small btn--outlined thumbnail-training__button-catalog" to="#">Отзывы</Link>
          </div>
        </div>
      </div>
    </li>
  );
}
