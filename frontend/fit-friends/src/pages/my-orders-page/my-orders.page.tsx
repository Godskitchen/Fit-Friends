/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment, LegacyRef, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import Header from 'src/components/header/header';
import LoadingBlock from 'src/components/loading-components/loading-block';
import OrderList from 'src/components/order-list/order-list';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { addOrdersToListAction, getOrderListAction } from 'src/store/api-actions';
import { getTrainingsDownloadingStatus } from 'src/store/app-data/app-data.selectors';
import { getOrderList, getTotalOrdersCount } from 'src/store/user-process/user-process.selectors';
import { HeaderNavTab } from 'src/types/constants';
import { OrderQueryState } from 'src/types/queries-filters.type';

const INITIAL_PAGE_NUMBER = 1;
const CARD_LIMIT_PER_PAGE = 4;

export default function MyOrdersPage(): JSX.Element {

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(getTrainingsDownloadingStatus);
  const totalOrdersCount = useAppSelector(getTotalOrdersCount);
  const orders = useAppSelector(getOrderList);

  const [queryState, setQueryState] = useState<OrderQueryState>();

  const [svgSumSortIcon, setSvgSumSortIcon] = useState<'#icon-sort-up' | '#icon-sort-down'>('#icon-sort-up');
  const [svgCountSortIcon, setSvgCountSortIcon ] = useState<'#icon-sort-up' | '#icon-sort-down'>('#icon-sort-up');

  const [currSortSumDirection, setCurrSortSumDirection] = useState<'asc' | 'desc'>('desc');
  const [currSortCountDirection, setCurrSortCountDirection] = useState<'asc' | 'desc'>('desc');

  const onShowMoreBtnClickHandle = () => {
    if (queryState) {
      const newQueryState = {
        ...queryState,
        page: queryState.page ? `${+queryState.page + 1}` : queryState.page
      };

      dispatch(addOrdersToListAction(newQueryState))
        .then((result) => {
          if (addOrdersToListAction.fulfilled.match(result)) {
            setQueryState(newQueryState);
          }
        });
    }
  };

  const onReturnToTopBtnHandle = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  useEffect(() => {
    const initialQuery = {
      limit: `${CARD_LIMIT_PER_PAGE}`,
      page: `${INITIAL_PAGE_NUMBER}`,
    };

    dispatch(getOrderListAction(initialQuery))
      .then((result) => {
        if (getOrderListAction.fulfilled.match(result)) {
          setQueryState(initialQuery);
        }
      });
  }, [dispatch]);

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [timeoutRef]);

  const onSortBySumBtnClickHandle = () => {
    if (queryState) {
      const newSortDirection = currSortSumDirection === 'desc' ? 'asc' : 'desc';

      const newQueryState: OrderQueryState = {
        ...queryState,
        page: `${INITIAL_PAGE_NUMBER}`,
        sort: 'sum',
        sortDirection: newSortDirection
      };
      setQueryState(newQueryState);
      setSvgSumSortIcon((currentIcon) =>
        currentIcon === '#icon-sort-up'
          ? '#icon-sort-down'
          : '#icon-sort-up'
      );
      setCurrSortSumDirection(newSortDirection);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        dispatch(getOrderListAction(newQueryState));
      }, 1000);
    }
  };

  const onSortByCountBtnClickHandle = () => {
    if (queryState) {
      const newSortDirection = currSortCountDirection === 'desc' ? 'asc' : 'desc';

      const newQueryState: OrderQueryState = {
        ...queryState,
        page: `${INITIAL_PAGE_NUMBER}`,
        sort: 'trainingCount',
        sortDirection: newSortDirection
      };
      setQueryState(newQueryState);
      setSvgCountSortIcon((currentIcon) =>
        currentIcon === '#icon-sort-up'
          ? '#icon-sort-down'
          : '#icon-sort-up'
      );
      setCurrSortCountDirection(newSortDirection);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        dispatch(getOrderListAction(newQueryState));
      }, 1000);
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title>Мои заказы — FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Home} />
        <main>
          <section className="my-orders">
            <div className="container">
              <div className="my-orders__wrapper">
                <button className="btn-flat btn-flat--underlined my-orders__back"
                  type="button"
                  onClick={() => navigate(AppRoute.CoachAccount)}
                >
                  <svg width="14" height="10" aria-hidden="true">
                    <use xlinkHref="#arrow-left"></use>
                  </svg>
                  <span>Назад</span>
                </button>
                {
                  !orders ?
                    <LoadingBlock /> :
                    <Fragment>
                      <div className="my-orders__title-wrapper">
                        <h1 className="my-orders__title">Мои заказы</h1>
                        <div className="sort-for">
                          <p>Сортировать по:</p>
                          <div className="sort-for__btn-container">
                            <button
                              className="btn-filter-sort"
                              type="button"
                              onClick={onSortBySumBtnClickHandle}
                            >
                              <span>Сумме</span>
                              <svg width="16" height="10" aria-hidden="true">
                                <use xlinkHref={svgSumSortIcon}></use>
                              </svg>
                            </button>
                            <button
                              className="btn-filter-sort"
                              type="button"
                              onClick={onSortByCountBtnClickHandle}
                            >
                              <span>Количеству</span>
                              <svg width="16" height="10" aria-hidden="true">
                                <use xlinkHref={svgCountSortIcon}></use>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <OrderList cards={orders} />
                      {isLoading && <LoadingBlock />}
                      <div className="show-more my-orders__show-more">
                        <button
                          className="btn show-more__button show-more__button--more"
                          type="button"
                          disabled={isLoading}
                          style={totalOrdersCount - orders.length <= 0 ? {display: 'none'} : {}}
                          onClick={onShowMoreBtnClickHandle}
                        >
                        Показать еще
                        </button>
                        <button
                          className={`btn show-more__button ${orders.length > 6 && (totalOrdersCount - orders.length <= 0) ? '' : 'show-more__button--to-top'}`}
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
