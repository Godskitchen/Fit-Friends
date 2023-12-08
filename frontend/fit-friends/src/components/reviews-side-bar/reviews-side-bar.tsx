import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';

export default function ReviewsSideBar(): JSX.Element {
  const navigate = useNavigate();

  return (
    <aside className="reviews-side-bar">
      <button
        className="btn-flat btn-flat--underlined reviews-side-bar__back"
        type="button"
        onClick={() => {navigate(`${AppRoute.CoachAccount}${AppRoute.MyTrainings}`);}}
      >
        <svg width="14" height="10" aria-hidden="true">
          <use xlinkHref="#arrow-left"></use>
        </svg>
        <span>Назад</span>
      </button>
      <h2 className="reviews-side-bar__title">Отзывы</h2>
      <ul className="reviews-side-bar__list">
      </ul>
      <button className="btn btn--medium reviews-side-bar__button" type="button" disabled>Оставить отзыв</button>
    </aside>
  );
}
