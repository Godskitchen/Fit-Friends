import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from 'src/components/header/header';
import LoadingBlock from 'src/components/loading-components/loading-block';
import TrainingsList from 'src/components/trainings-list/trainings-list';
import TrainingsCatalogFiltersDesk from 'src/components/filter-desk/trainings-catalog-filter-desk';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { addTrainingsToListAction } from 'src/store/api-actions';
import { getTotalTrainingsCount, getTrainingList, getTrainingsDownloadingStatus } from 'src/store/app-data/app-data.selectors';
import { setTrainingCatalogFilterStateAction } from 'src/store/main-process/main-process.reducer';
import { getTrainingsCatalogFilterState } from 'src/store/main-process/main-process.selectors';
import { HeaderNavTab, Role } from 'src/types/constants';
import { getMyProfileInfo } from 'src/store/user-process/user-process.selectors';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';

export default function TrainingCatalogPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const trainings = useAppSelector(getTrainingList);
  const isLoading = useAppSelector(getTrainingsDownloadingStatus);
  const filterState = useAppSelector(getTrainingsCatalogFilterState);
  const totalTrainingsCount = useAppSelector(getTotalTrainingsCount);
  const myProfile = useAppSelector(getMyProfileInfo);

  const navigate = useNavigate();

  useEffect(() => {
    if (myProfile) {
      if (myProfile.role === Role.Trainer && !myProfile.trainerProfile) {
        navigate(AppRoute.QuestionnaireCoach, {replace: true});
      } else if (myProfile.role === Role.User && !myProfile.userProfile) {
        navigate(AppRoute.QuestionnaireUser, {replace: true});
      } else if (myProfile.role === Role.Trainer) {
        navigate(AppRoute.CoachAccount, {replace: true});
      }
    }
  }, [myProfile, navigate]);

  const onShowMoreBtnClickHandle = () => {
    const newFilterState = {
      ...filterState,
      page: filterState.page ? `${+filterState.page + 1}` : filterState.page
    };

    dispatch(addTrainingsToListAction(newFilterState))
      .then((result) => {
        if (addTrainingsToListAction.fulfilled.match(result)) {
          dispatch(setTrainingCatalogFilterStateAction(newFilterState));
        }
      });
  };


  const onReturnToTopBtnHandle = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  if (trainings === null) {
    return <p>error</p>;
  }

  return (
    <Fragment>
      <Helmet>
        <title>Каталог тренировок — FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Home} />
        <main>
          <section className="inner-page">
            <div className="container">
              <div className="inner-page__wrapper">
                <h1 className="visually-hidden">Каталог тренировок</h1>
                <TrainingsCatalogFiltersDesk />
                {
                  !trainings ?
                    <LoadingBlock /> :
                    <div className="training-catalog">
                      <TrainingsList
                        trainingCards={trainings}
                        listClassName='training-catalog__list'
                        itemClassName='training-catalog__item'
                      />
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
                }
              </div>
            </div>
          </section>
        </main>
      </div>
    </Fragment>
  );
}
