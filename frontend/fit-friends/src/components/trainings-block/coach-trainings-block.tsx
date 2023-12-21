import { Fragment, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { addTrainingsToListAction, getTrainingListAction } from 'src/store/api-actions';
import { getTotalTrainingsCount, getTrainingList } from 'src/store/app-data/app-data.selectors';
import LoadingBlock from '../loading-components/loading-block';
import TrainingCard from '../training-card/training-card';
import { TrainingsCatalogFiltersState } from 'src/types/queries-filters.type';

const CARD_WIDTH = 334;
const CARD_GAP = 20;
const DESK_WIDTH = 1396;

type TrainingBlockProps = {
  trainerId: number;
}

const INITIAL_CARDS_LIMIT = 50;
const INITIAL_PAGE_NUMBER = 1;

export default function CoachTrainingsBlock({trainerId}: TrainingBlockProps): JSX.Element {
  const dispatch = useAppDispatch();
  const initialQuery = useMemo(() => ({
    limit: `${INITIAL_CARDS_LIMIT}`,
    page: `${INITIAL_PAGE_NUMBER}`,
    trainerId: `${trainerId}`
  }), [trainerId]);

  const [queryState, setQueryState] = useState<TrainingsCatalogFiltersState>(initialQuery);

  useEffect(() => {
    dispatch(getTrainingListAction(initialQuery));
  }, [dispatch, initialQuery]);

  const trainingList = useAppSelector(getTrainingList);

  useEffect(() => {
    if (trainingList) {
      setCurrentMaxOffset(-(CARD_WIDTH * trainingList.length + CARD_GAP * (trainingList.length - 1) - DESK_WIDTH));
    }
  }, [trainingList]);

  const totalTrainingsCount = useAppSelector(getTotalTrainingsCount);

  const [offset, setOffset] = useState(0);
  const minOffset = 0;
  const [currentMaxOffset, setCurrentMaxOffset] = useState(0);

  if (trainingList === null) {
    return <p>Error</p>;
  }

  if (!trainingList) {
    return <LoadingBlock />;
  }

  const remainingCount = totalTrainingsCount - trainingList.length;

  const handleLeftArrowClick = () => {
    setOffset((currentOffset) => {
      const newOffset = currentOffset + ((CARD_WIDTH + CARD_GAP) * 4);
      return newOffset < minOffset ? newOffset : minOffset;
    });
  };

  const handleRightArrowClick = () => {
    if (remainingCount > 0) {
      const newQueryState = {...queryState, page: queryState.page ? `${+queryState.page + 1}` : queryState.page};
      dispatch(addTrainingsToListAction(newQueryState))
        .then((result) => {
          if (addTrainingsToListAction.fulfilled.match(result)) {
            const {trainingList: newTrainingList} = result.payload;
            setQueryState(newQueryState);
            setOffset((currentOffset) => {
              let newOffset: number;
              const newMaxOffset = -(CARD_WIDTH * (trainingList.length + newTrainingList.length) + CARD_GAP * (trainingList.length + newTrainingList.length - 1) - DESK_WIDTH);
              if (newTrainingList.length >= 4) {
                newOffset = currentOffset - ((CARD_WIDTH + CARD_GAP) * 4);
              } else {
                newOffset = currentOffset - ((CARD_WIDTH + CARD_GAP) * newTrainingList.length);
              }
              return newOffset > newMaxOffset ? newOffset : newMaxOffset;
            });
          }
        });
    } else {
      setOffset((currentOffset) => {
        const newOffset = currentOffset - ((CARD_WIDTH + CARD_GAP) * 4);
        return newOffset > currentMaxOffset ? newOffset : currentMaxOffset;
      });
    }
  };

  return (
    <Fragment>
      <div className="user-card-coach__training-head">
        <h2 className="user-card-coach__training-title">Тренировки</h2>
        <div className="user-card-coach__training-bts">
          <button
            className="btn-icon user-card-coach__training-btn"
            type="button"
            aria-label="back"
            onClick={handleLeftArrowClick}
            disabled={offset === minOffset}
          >
            <svg width="14" height="10" aria-hidden="true">
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </button>
          <button
            className="btn-icon user-card-coach__training-btn"
            type="button"
            aria-label="next"
            onClick={handleRightArrowClick}
            disabled={totalTrainingsCount <= 4 || (offset === currentMaxOffset && remainingCount === 0)}
          >
            <svg width="14" height="10" aria-hidden="true">
              <use xlinkHref="#arrow-right"></use>
            </svg>
          </button>
        </div>
      </div>
      <ul className="user-card-coach__training-list" style={{overflow: 'hidden'}}>
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
              className='user-card-coach__training-item'
            />
          ))}
        </div>
      </ul>
    </Fragment>
  );
}
