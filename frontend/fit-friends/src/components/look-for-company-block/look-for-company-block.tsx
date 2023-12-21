import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getReadyUsersListAction } from 'src/store/api-actions';
import { getReadyUsersList, getTrainingsDownloadingStatus } from 'src/store/app-data/app-data.selectors';
import { UsersCatalogFiltersState } from 'src/types/queries-filters.type';
import LoadingBlock from '../loading-components/loading-block';
import UserSmallCard from '../user-card/user-small-card';

const LIMIT_USER_CARD = 8;

const initialQuery: UsersCatalogFiltersState = {
  limit: `${LIMIT_USER_CARD}`,
  isReady: true,
  role: 'User'
};

const CARD_WIDTH = 334;
const CARD_GAP = 20;
const DESK_WIDTH = 1396;

export default function LookForCompanyBlock(): JSX.Element {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [offset, setOffset] = useState(0);
  const minOffset = 0;
  const [maxOffset, setMaxOffset] = useState(0);
  const isLoading = useAppSelector(getTrainingsDownloadingStatus);

  useEffect(() => {
    dispatch(getReadyUsersListAction(initialQuery));
  }, [dispatch]);

  const userList = useAppSelector(getReadyUsersList);

  useEffect(() => {
    if (userList) {
      setMaxOffset(-(CARD_WIDTH * userList.length + CARD_GAP * (userList.length - 1) - DESK_WIDTH));
    }

  }, [userList]);

  if (!userList || isLoading) {
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

  let idCounter = 0;

  return (
    <section className="look-for-company">
      <div className="container">
        <div className="look-for-company__wrapper">
          <div className="look-for-company__title-wrapper">
            <h2 className="look-for-company__title">Ищут компанию для тренировки</h2>
            <button
              className="btn-flat btn-flat--light look-for-company__button"
              type="button"
              onClick={() => navigate(AppRoute.UsersCatalog)}
            >
              <span>Смотреть все</span>
              <svg width="14" height="10" aria-hidden="true">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </button>
            <div className="look-for-company__controls">
              <button
                className="btn-icon btn-icon--outlined look-for-company__control"
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
                className="btn-icon btn-icon--outlined look-for-company__control"
                type="button" aria-label="next"
                onClick={handleRightArrowClick}
                disabled={userList.length <= 4 || offset === maxOffset}
              >
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#arrow-right"></use>
                </svg>
              </button>
            </div>
          </div>
          <ul className="look-for-company__list" style={{overflow: 'hidden'}}>
            <div style={{
              transform: `translateX(${offset}px)`,
              display: 'flex',
              transition: 'transform 600ms ease-in-out'
            }}
            >
              {userList.map((card) => (<UserSmallCard key={idCounter++} card={card}/>))}
            </div>
          </ul>
        </div>
      </div>
    </section>
  );
}
