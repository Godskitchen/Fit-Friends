import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import ErrorScreen from 'src/components/error-screen/error-screen';
import FriendList from 'src/components/friend-list/friend-list';
import Header from 'src/components/header/header';
import LoadingBlock from 'src/components/loading-components/loading-block';
import LoadingScreen from 'src/components/loading-components/loading-screen';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { addFriendsToListAction, getFriendListAction } from 'src/store/api-actions';
import { getUsersDownloadingStatus } from 'src/store/app-data/app-data.selectors';
import { setFriendsQueryStateAction } from 'src/store/main-process/main-process.reducer';
import { getFriendsQueryState } from 'src/store/main-process/main-process.selectors';
import { getFriendList, getTotalFriendsCount, getMyProfileInfo } from 'src/store/user-process/user-process.selectors';
import { HeaderNavTab, Role } from 'src/types/constants';

const CARD_LIMIT_PER_PAGE = 6;
const INITIAL_PAGE_NUMBER = 1;

export default function MyFriendsPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const myProfile = useAppSelector(getMyProfileInfo);
  let myReadyStatus = false;
  const navigate = useNavigate();
  const queryState = useAppSelector(getFriendsQueryState);


  useEffect(() => {
    if (myProfile) {
      if (myProfile.role === Role.Trainer && !myProfile.trainerProfile) {
        navigate(AppRoute.QuestionnaireCoach, {replace: true});
      } else if (myProfile.role === Role.User && !myProfile.userProfile) {
        navigate(AppRoute.QuestionnaireUser, {replace: true});
      }

      if (window.location.href.includes('account_coach') && myProfile.role === Role.User) {
        navigate(`${AppRoute.UserAccount}${AppRoute.MyFriends}`, {replace: true});
      } else if (window.location.href.includes('account_user') && myProfile.role === Role.Trainer) {
        navigate(`${AppRoute.CoachAccount}${AppRoute.MyFriends}`, {replace: true});
      }
    }
  }, [myProfile, navigate]);

  useEffect(() => {
    const initialQuery = {
      limit: `${CARD_LIMIT_PER_PAGE}`,
      page: `${INITIAL_PAGE_NUMBER}`
    };

    dispatch(getFriendListAction(initialQuery))
      .then((result) => {
        if (getFriendListAction.fulfilled.match(result)) {
          dispatch(setFriendsQueryStateAction(initialQuery));
        }
      });
  }, [dispatch]);


  const friends = useAppSelector(getFriendList);
  const isLoading = useAppSelector(getUsersDownloadingStatus);
  const totalFriendsCount = useAppSelector(getTotalFriendsCount);

  const onShowMoreBtnClickHandle = () => {
    const newQueryState = {...queryState, page: queryState.page ? `${+queryState.page + 1}` : queryState.page};
    dispatch(addFriendsToListAction(newQueryState))
      .then((result) => {
        if (addFriendsToListAction.fulfilled.match(result)) {
          dispatch(setFriendsQueryStateAction(newQueryState));
        }
      });
  };

  const onReturnToTopBtnHandle = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  if (myProfile === null || friends === null) {
    return <ErrorScreen />;
  }

  if (!myProfile) {
    return <LoadingScreen />;
  }

  if (myProfile.trainerProfile) {
    myReadyStatus = myProfile.trainerProfile.individualTraining;
  } else if (myProfile.userProfile) {
    myReadyStatus = myProfile.userProfile.readyForWorkout;
  }

  return (
    <Fragment>
      <Helmet>
        <title>Список друзей — FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Friends} />
        <main>
          <section className="friends-list">
            <div className="container">
              {
                !friends ?
                  <LoadingBlock /> :
                  <div className="friends-list__wrapper">
                    <button
                      className="btn-flat friends-list__back"
                      type="button"
                      onClick={() => navigate(myProfile.role === Role.User ? AppRoute.UserAccount : AppRoute.CoachAccount)}
                    >
                      <svg width="14" height="10" aria-hidden="true">
                        <use xlinkHref="#arrow-left"></use>
                      </svg>
                      <span>Назад</span>
                    </button>
                    <div className="friends-list__title-wrapper">
                      <h1 className="friends-list__title">Мои друзья</h1>
                    </div>
                    <FriendList friendCards={friends} myReadyStatus={myReadyStatus} myRole={myProfile.role}/>
                    {isLoading && <LoadingBlock />}
                    <div className="show-more friends-list__show-more">
                      <button
                        className="btn show-more__button show-more__button--more"
                        type="button"
                        disabled={isLoading}
                        style={totalFriendsCount - friends.length <= 0 ? {display: 'none'} : {}}
                        onClick={onShowMoreBtnClickHandle}
                        data-testid="show-more-btn"
                      >
                        Показать еще
                      </button>
                      <button
                        className="btn show-more__button show-more__button--to-top"
                        type="button"
                        style={{display: (friends.length > 6 && (totalFriendsCount - friends.length <= 0)) ? 'block' : 'none'}}
                        onClick={onReturnToTopBtnHandle}
                        data-testid="return-top-btn"
                      >
                        Вернуться в начало
                      </button>
                    </div>
                  </div>
              }
            </div>
          </section>
        </main>
      </div>
    </Fragment>
  );
}
