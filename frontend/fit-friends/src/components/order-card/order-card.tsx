import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { SpecialisationHashTagValue } from 'src/types/constants';
import { TrainingCardType } from 'src/types/training.type';
import { formatNumber } from 'src/utils/helpers';

type OrderCardProp = {
  training: TrainingCardType;
  sum: number;
  trainingCount: number;
}

export default function OrderCard({training: {
  trainingId,
  title,
  backgroundImage,
  price,
  specialisation,
  caloriesToBurn,
  rating,
  description,
}, sum, trainingCount}: OrderCardProp): JSX.Element {
  return (
    <li className="my-orders__item" data-testid="order-card">
      <div className="thumbnail-training">
        <div className="thumbnail-training__inner">
          <div className="thumbnail-training__image">
            <picture>
              <img src={backgroundImage}
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
          <h2 className="thumbnail-training__title">{title}</h2>
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
              </svg><span className="thumbnail-training__rate-value">{rating.toFixed()}</span>
            </div>
          </div>
          <div className="thumbnail-training__text-wrapper">
            <p className="thumbnail-training__text">
              {description}
            </p>
          </div>
          <Link className="btn-flat btn-flat--underlined thumbnail-training__button-orders"
            to={`${AppRoute.TrainingsCatalog}/${trainingId}`}
          >
            <svg width="18" height="18" aria-hidden="true">
              <use xlinkHref="#icon-info"></use>
            </svg>
            <span>Подробнее</span>
          </Link>
        </div>
        <div className="thumbnail-training__total-info">
          <div className="thumbnail-training__total-info-card">
            <svg width="32" height="32" aria-hidden="true">
              <use xlinkHref="#icon-chart"></use>
            </svg>
            <p className="thumbnail-training__total-info-value">{trainingCount}</p>
            <p className="thumbnail-training__total-info-text">Куплено тренировок</p>
          </div>
          <div className="thumbnail-training__total-info-card">
            <svg width="31" height="28" aria-hidden="true">
              <use xlinkHref="#icon-wallet"></use>
            </svg>
            <p className="thumbnail-training__total-info-value">{formatNumber(sum)}<span>₽</span></p>
            <p className="thumbnail-training__total-info-text">Общая сумма</p>
          </div>
        </div>
      </div>
    </li>
  );
}
