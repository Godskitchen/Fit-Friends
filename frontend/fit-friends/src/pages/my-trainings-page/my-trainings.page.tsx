import { HeaderNavTab } from 'src/types/constants';
import Header from '../../components/header/header';
import { Helmet } from 'react-helmet-async';
import { Fragment } from 'react';
import MyTrainingsFilterDesk from '../../components/my-trainings-filter-desk/my-trainings-filter-desk';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getMyTrainings, getTotalMyTrainingsCount} from 'src/store/user-process/user-process.selectors';
import {getMyTrainingsFiltersState} from 'src/store/main-process/main-process.selectors';
import LoadingBlock from 'src/components/loading-components/loading-block';
import MyTrainingsList from 'src/components/my-trainings-list/my-trainings-list';
import { getTrainingsDownloadingStatus } from 'src/store/app-data/app-data.selectors';
import { addMoreTrainingsToListAction } from 'src/store/api-actions';
import { setMyTrainingsFiltersStateAction } from 'src/store/main-process/main-process.reducer';

export default function MyTrainingsPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const trainings = useAppSelector(getMyTrainings);
  const isLoading = useAppSelector(getTrainingsDownloadingStatus);
  const filterState = useAppSelector(getMyTrainingsFiltersState);
  const totalTrainingsCount = useAppSelector(getTotalMyTrainingsCount);

  const onShowMoreBtnClickHandle = () => {
    const newFilterState = {...filterState, page: filterState.page ? `${+filterState.page + 1}` : filterState.page};
    dispatch(addMoreTrainingsToListAction(newFilterState))
      .then(() => {dispatch(setMyTrainingsFiltersStateAction(newFilterState));});
  };

  const onReturnToTopBtnHandle = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <Fragment>
      <Helmet>
        <title>Мои тренировки — FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Home} />
        <main>
          <section className="inner-page">
            <div className="container">
              <div className="inner-page__wrapper">
                <h1 className="visually-hidden">Мои тренировки</h1>
                <div className="my-training-form">
                  <h2 className="visually-hidden">Мои тренировки Фильтр</h2>
                  <MyTrainingsFilterDesk />
                </div>
                {
                  !trainings ?
                    <LoadingBlock /> :
                    <div className="inner-page__content">
                      <div className="my-trainings">
                        <MyTrainingsList trainingCards={trainings} />
                        {isLoading && <LoadingBlock />}
                        <div className="show-more my-trainings__show-more">
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
                      </div>
                    </div>
                }
              </div>
            </div>
          </section>
        </main>
      </div>
    </Fragment>
  );
}

