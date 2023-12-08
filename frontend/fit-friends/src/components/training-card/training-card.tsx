import { Link } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { Specialisation } from 'src/types/constants';
import { MyTraining } from 'src/types/training.type';

const SpecialisationHashTagValue: Record<Specialisation, string> = {
  [Specialisation.Aerobics]: '#аэробика',
  [Specialisation.Boxing]: '#бокс',
  [Specialisation.Yoga]: '#йога',
  [Specialisation.Running]: '#бег',
  [Specialisation.Power]: '#силовые',
  [Specialisation.Crossfit]: '#кроссфит',
  [Specialisation.Pilates]: '#пилатес',
  [Specialisation.Stretching]: '#стрейчинг'
};

type TrainingCardProp = {
  card: MyTraining;
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
}}: TrainingCardProp): JSX.Element {
  return (
    <li className="my-trainings__item">
      <div className="thumbnail-training">
        <div className="thumbnail-training__inner">
          <div className="thumbnail-training__image">
            <picture>
              <source type="image/webp" srcSet={backgroundImage} />
              <img
                src={backgroundImage}
                srcSet={backgroundImage}
                width="330" height="190"
                alt=""
              />
            </picture>
          </div>
          <p className="thumbnail-training__price">
            <span className="thumbnail-training__price-value">{price}</span>
            <span>₽</span>
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
