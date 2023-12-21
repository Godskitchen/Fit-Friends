import { Link } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';

type SpecialTrainingCardProps = {
  backgroundImage: string;
  title: string;
  trainingId: number;
}
export default function SpecialTrainingCard({backgroundImage, title, trainingId}: SpecialTrainingCardProps): JSX.Element {
  return (
    <li className="special-for-you__item">
      <div className="thumbnail-preview" style={{boxShadow: 'none'}}>
        <div className="thumbnail-preview__image">
          <picture>
            <img src={backgroundImage} width="452" height="191" alt="" />
          </picture>
        </div>
        <div className="thumbnail-preview__inner">
          <h3 className="thumbnail-preview__title">{title}</h3>
          <div className="thumbnail-preview__button-wrapper">
            <Link className="btn btn--small thumbnail-preview__button" to={`${AppRoute.TrainingsCatalog}/${trainingId}`}>Подробнее</Link>
          </div>
        </div>
      </div>
    </li>
  );
}
