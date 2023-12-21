import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getTrainingListAction } from 'src/store/api-actions';
import { getTrainingList } from 'src/store/app-data/app-data.selectors';
import { TrainingsCatalogFiltersState } from 'src/types/queries-filters.type';
import LoadingBlock from '../loading-components/loading-block';
import TrainingCard from '../training-card/training-card';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';

const initialQuery: TrainingsCatalogFiltersState = {
  rating: '4,5',
  sort: 'rating'
};

const CARD_WIDTH = 334;
const CARD_GAP = 20;
const DESK_WIDTH = 1396;

export default function PopularTrainingsBlock(): JSX.Element {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [offset, setOffset] = useState(0);
  const minOffset = 0;
  const [maxOffset, setMaxOffset] = useState(0);

  useEffect(() => {
    dispatch(getTrainingListAction(initialQuery));
  }, [dispatch]);

  const trainingList = useAppSelector(getTrainingList);

  useEffect(() => {
    if (trainingList) {
      setMaxOffset(-(CARD_WIDTH * trainingList.length + CARD_GAP * (trainingList.length - 1) - DESK_WIDTH));
    }
  }, [trainingList]);


  if (!trainingList) {
    return <LoadingBlock />;
  }

  const handleLeftArrowClick = () => {
    setOffset((currentOffset) => {
      const newOffset = currentOffset + (CARD_WIDTH + CARD_GAP);
      return newOffset < minOffset ? newOffset : minOffset;
    });
  };

  const handleRightArrowClick = () => {
    setOffset((currentOffset) => {
      const newOffset = currentOffset - (CARD_WIDTH + CARD_GAP);
      return newOffset > maxOffset ? newOffset : maxOffset;
    });
  };

  return (
    <section className="popular-trainings">
      <div className="container">
        <div className="popular-trainings__wrapper">
          <div className="popular-trainings__title-wrapper">
            <h2 className="popular-trainings__title">Популярные тренировки</h2>
            <button
              className="btn-flat popular-trainings__button"
              type="button"
              onClick={() => navigate(AppRoute.TrainingsCatalog)}
            >
              <span>Смотреть все</span>
              <svg width="14" height="10" aria-hidden="true">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </button>
            <div className="popular-trainings__controls">
              <button
                className="btn-icon popular-trainings__control"
                type="button"
                aria-label="previous"
                onClick={handleLeftArrowClick}
                disabled={offset === minOffset}
              >
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#arrow-left"></use>
                </svg>
              </button>
              <button className="btn-icon popular-trainings__control"
                type="button"
                aria-label="next"
                onClick={handleRightArrowClick}
                disabled={trainingList.length <= 4 || (offset === maxOffset)}
              >
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#arrow-right"></use>
                </svg>
              </button>
            </div>
          </div>
          <ul className="popular-trainings__list" style={{overflow: 'hidden'}}>
            <div style={{
              transform: `translateX(${offset}px)`,
              display: 'flex',
              transition: 'transform 600ms ease-in-out'
            }}
            >
              {trainingList.map((card) => (
                <TrainingCard
                  key={card.trainingId}
                  card={card}
                  className='popular-trainings__item'
                />
              ))}
            </div>
          </ul>
        </div>
      </div>
    </section>
  );
}
