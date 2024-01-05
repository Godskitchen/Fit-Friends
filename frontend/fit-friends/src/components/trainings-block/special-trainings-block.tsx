import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getSpecialTrainingListAction } from 'src/store/api-actions';
import { getSpecialTrainingsList } from 'src/store/user-process/user-process.selectors';
import { SpecialTrainingsQueryState } from 'src/types/queries-filters.type';
import { UserProfileInfo } from 'src/types/user.type';
import LoadingBlock from '../loading-components/loading-block';
import SpecialTrainingCard from '../special-training-card/special-training-card';

type SpecialTrainingsBlockProps = {
  userProfile: UserProfileInfo;
}

const SPECIAL_TRAININGS_LIMIT = 9;

const CARD_WIDTH = 452;
const CARD_GAP = 20;
const DESK_WIDTH = 1396;

export default function SpecialTrainingsBlock({userProfile}: SpecialTrainingsBlockProps): JSX.Element {

  const dispatch = useAppDispatch();
  const trainings = useAppSelector(getSpecialTrainingsList);

  const [offset, setOffset] = useState(0);
  const minOffset = 0;
  const [maxOffset, setMaxOffset] = useState(0);

  useEffect(() => {
    const initialQuery: SpecialTrainingsQueryState = {
      limit: `${SPECIAL_TRAININGS_LIMIT}`,
      trainingDuration: userProfile.trainingDuration,
      trainingType: userProfile.specialisations.join(','),
      fitnessLevel: userProfile.skillLevel
    };

    dispatch(getSpecialTrainingListAction(initialQuery));
  }, [dispatch, userProfile]);

  useEffect(() => {
    if (trainings) {
      setMaxOffset(-(CARD_WIDTH * trainings.length + CARD_GAP * (trainings.length - 1) - DESK_WIDTH));
    }
  }, [trainings]);

  if (!trainings) {
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
    <section className="special-for-you">
      <div className="container">
        <div className="special-for-you__wrapper">
          <div className="special-for-you__title-wrapper">
            <h2 className="special-for-you__title">Специально подобрано для вас</h2>
            <div className="special-for-you__controls">
              <button
                className="btn-icon special-for-you__control"
                type="button"
                aria-label="previous"
                onClick={handleLeftArrowClick}
                disabled={offset === minOffset}
              >
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#arrow-left"></use>
                </svg>
              </button>
              <button
                className="btn-icon special-for-you__control"
                type="button"
                aria-label="next"
                onClick={handleRightArrowClick}
                disabled={trainings.length <= 3 || (offset === maxOffset)}
              >
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#arrow-right"></use>
                </svg>
              </button>
            </div>
          </div>
          <ul className="special-for-you__list" style={{overflowX: 'hidden'}}>
            <div style={{
              transform: `translateX(${offset}px)`,
              display: 'flex',
              transition: 'transform 600ms ease-in-out'
            }}
            >
              {
                trainings.map(({backgroundImage, title, trainingId}) => (
                  <SpecialTrainingCard
                    key={trainingId}
                    backgroundImage={backgroundImage}
                    title={title}
                    trainingId={trainingId}
                  />))
              }
            </div>
          </ul>
        </div>
      </div>
    </section>
  );
}
