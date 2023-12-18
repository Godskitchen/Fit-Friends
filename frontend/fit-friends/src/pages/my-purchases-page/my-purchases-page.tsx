import { Fragment, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import Header from 'src/components/header/header';
import LoadingBlock from 'src/components/loading-components/loading-block';
import TrainingsList from 'src/components/trainings-list/trainings-list';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { addPurchasesToListAction, getPurchasesListAction } from 'src/store/api-actions';
import { getTrainingsDownloadingStatus } from 'src/store/app-data/app-data.selectors';
import { getMyProfileInfo, getMyTrainings, getTotalMyTrainingsCount } from 'src/store/user-process/user-process.selectors';
import { HeaderNavTab } from 'src/types/constants';
import { BalanceQueryState } from 'src/types/forms.type';

const CARD_LIMIT_PER_PAGE = 6;
const INITIAL_PAGE_NUMBER = 1;


export default function MyPurchasesPage(): JSX.Element {

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const trainings = useAppSelector(getMyTrainings);
  const totalTrainingsCount = useAppSelector(getTotalMyTrainingsCount);
  const myProfile = useAppSelector(getMyProfileInfo);
  const isLoading = useAppSelector(getTrainingsDownloadingStatus);

  const [queryState, setQueryState] = useState<BalanceQueryState>();

  useEffect(() => {
    if (myProfile) {
      const initialQuery = {
        userId: myProfile.userId,
        limit: `${CARD_LIMIT_PER_PAGE}`,
        page: `${INITIAL_PAGE_NUMBER}`,
      };
      dispatch(getPurchasesListAction(initialQuery))
        .then((result) => {
          if (getPurchasesListAction.fulfilled.match(result)) {
            setQueryState(initialQuery);
          }
        });
    }
  }, [dispatch, myProfile]);

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [timeoutRef]);

  const onShowMoreBtnClickHandle = () => {
    if (queryState) {
      const newQueryState = {
        ...queryState,
        page: queryState.page ? `${+queryState.page + 1}` : queryState.page
      };

      dispatch(addPurchasesToListAction(newQueryState))
        .then((result) => {
          if (addPurchasesToListAction.fulfilled.match(result)) {
            setQueryState(newQueryState);
          }
        });
    }
  };

  const onActivePurchasesCheckboxChangeHandle = () => {
    if (queryState) {
      const newQueryState = {
        ...queryState,
        page: `${INITIAL_PAGE_NUMBER}`,
        active: queryState.active ? undefined : true,
      };
      setQueryState(newQueryState);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        dispatch(getPurchasesListAction(newQueryState));
      }, 1000);
    }
  };

  const onReturnToTopBtnHandle = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <Fragment>
      <Helmet>
        <title>Мои покупки - FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Profile} />
        <main>
          <section className="my-purchases">
            <div className="container">
              <div className="my-purchases__wrapper">
                <button
                  className="btn-flat my-purchases__back"
                  type="button"
                  onClick={() => navigate(AppRoute.UserAccount)}
                >
                  <svg width="14" height="10" aria-hidden="true">
                    <use xlinkHref="#arrow-left"></use>
                  </svg>
                  <span>Назад</span>
                </button>
                <div className="my-purchases__title-wrapper">
                  <h1 className="my-purchases__title">Мои покупки</h1>
                  <div className="my-purchases__controls">
                    <div className="custom-toggle custom-toggle--switch custom-toggle--switch-right my-purchases__switch" data-validate-type="checkbox">
                      <label>
                        <input
                          type="checkbox"
                          value="active"
                          name="active"
                          checked={queryState !== undefined && queryState.active === true}
                          onChange={onActivePurchasesCheckboxChangeHandle}
                        />
                        <span className="custom-toggle__icon">
                          <svg width="9" height="6" aria-hidden="true">
                            <use xlinkHref="#arrow-check"></use>
                          </svg>
                        </span>
                        <span className="custom-toggle__label">Только активные</span>
                      </label>
                    </div>
                  </div>
                </div>
                {
                  !trainings ?
                    <LoadingBlock /> :
                    <Fragment>
                      <TrainingsList
                        trainingCards={trainings}
                        listClassName='my-purchases__list'
                        itemClassName='my-purchases__item'
                      />
                      {isLoading && <LoadingBlock />}
                      <div className="show-more my-purchases__show-more">
                        <button
                          className="btn show-more__button show-more__button--more"
                          type="button"
                          onClick={onShowMoreBtnClickHandle}
                          disabled={isLoading}
                          style={totalTrainingsCount - trainings.length <= 0 ? {display: 'none'} : {}}
                        >
                          Показать еще
                        </button>
                        <button
                          className={`btn show-more__button ${trainings.length > 6 && (totalTrainingsCount - trainings.length <= 0) ? '' : 'show-more__button--to-top'}`}
                          type="button"
                          onClick={onReturnToTopBtnHandle}
                        >
                            Вернуться в начало
                        </button>
                      </div>
                    </Fragment>
                }
              </div>
            </div>
          </section>
        </main>
      </div>
    </Fragment>
  );
}

