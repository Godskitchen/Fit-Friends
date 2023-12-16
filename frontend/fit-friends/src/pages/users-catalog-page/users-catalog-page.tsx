import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from 'src/components/header/header';
import LoadingBlock from 'src/components/loading-components/loading-block';
import UserList from 'src/components/user-list/user-list';
import UsersCatalogFiltersDesk from 'src/components/users-catalog-filters-desk/users-catalog-filters-desk';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { addMoreUsersToListAction } from 'src/store/api-actions';
import { getTotalUsersCount, getUserList, getUsersDownloadingStatus } from 'src/store/app-data/app-data.selectors';
import { setUsersCatalogFilterStateAction } from 'src/store/main-process/main-process.reducer';
import { getUsersCatalogFilterState } from 'src/store/main-process/main-process.selectors';
import { HeaderNavTab } from 'src/types/constants';

export default function UsersCatalogPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const users = useAppSelector(getUserList);
  const isLoading = useAppSelector(getUsersDownloadingStatus);
  const filterState = useAppSelector(getUsersCatalogFilterState);
  const totalUsersCount = useAppSelector(getTotalUsersCount);

  const onShowMoreBtnClickHandle = () => {
    const newFilterState = {
      ...filterState,
      page: filterState.page ? `${+filterState.page + 1}` : filterState.page
    };

    dispatch(addMoreUsersToListAction(newFilterState))
      .then((result) => {
        if (addMoreUsersToListAction.fulfilled.match(result)) {
          dispatch(setUsersCatalogFilterStateAction(newFilterState));
        }
      });
  };

  const onReturnToTopBtnHandle = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <Fragment>
      <Helmet>
        <title>Каталог пользователей — FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Home} />
        <main>
          <section className="inner-page">
            <div className="container">
              <div className="inner-page__wrapper">
                <h1 className="visually-hidden">Каталог пользователей</h1>
                <UsersCatalogFiltersDesk />
                {
                  !users ?
                    <LoadingBlock /> :
                    <div className="inner-page__content">
                      <div className="users-catalog">
                        <UserList userCards={users}/>
                        {isLoading && <LoadingBlock />}
                        <div className="show-more users-catalog__show-more">
                          <button
                            className="btn show-more__button show-more__button--more"
                            type="button"
                            onClick={onShowMoreBtnClickHandle}
                            disabled={isLoading}
                            style={totalUsersCount - users.length <= 0 ? {display: 'none'} : {}}
                          >
                          Показать еще
                          </button>
                          <button
                            className={`btn show-more__button ${users.length > 6 && (totalUsersCount - users.length <= 0) ? '' : 'show-more__button--to-top'}`}
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

