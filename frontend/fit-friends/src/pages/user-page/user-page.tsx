import { Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getUserDetailsAction } from 'src/store/api-actions';
import { getCurrentUserInfo, getNetworkError, getUsersDownloadingStatus } from 'src/store/app-data/app-data.selectors';
import NotFoundPage from '../not-found-page/not-found.page';
import LoadingScreen from 'src/components/loading-components/loading-screen';
import { HeaderNavTab, Role } from 'src/types/constants';
import Header from 'src/components/header/header';
import { Helmet } from 'react-helmet-async';
import CoachInfoBlock from 'src/components/user-info-block/coach-info-block';
import UserInfoBlock from 'src/components/user-info-block/user-info-block';
import { getMyProfileInfo } from 'src/store/user-process/user-process.selectors';
import { AppRoute } from 'src/app-constants';
import ErrorScreen from 'src/components/error-components/error-screen';

export default function UserPage(): JSX.Element {
  const {userId} = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isUserLoading = useAppSelector(getUsersDownloadingStatus);
  const isNetworkError = useAppSelector(getNetworkError);

  useEffect(() => {
    if (userId) {
      dispatch(getUserDetailsAction(userId));
    }
  }, [userId, dispatch]);

  const user = useAppSelector(getCurrentUserInfo);
  const myProfile = useAppSelector(getMyProfileInfo);

  useEffect(() => {
    if (myProfile) {
      if (myProfile.role === Role.Trainer && !myProfile.trainerProfile) {
        navigate(AppRoute.QuestionnaireCoach, {replace: true});
      } else if (myProfile.role === Role.User && !myProfile.userProfile) {
        navigate(AppRoute.QuestionnaireUser, {replace: true});
      }
    }
  }, [myProfile, navigate]);

  if (user === undefined || isUserLoading || !myProfile) {
    return <LoadingScreen />;
  }

  if (user === null || !userId ) {
    if (isNetworkError) {
      return <ErrorScreen />;
    }
    return <NotFoundPage />;
  }

  const onBtnBackClickHandle = () => {
    navigate(`${myProfile.role === Role.User ? `${AppRoute.UsersCatalog}` : `${AppRoute.CoachAccount}${AppRoute.MyFriends}`}`);
  };

  return (
    <Fragment>
      <Helmet>
        <title>Карточка пользователя — FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Home}/>
        <main>
          <div className="inner-page inner-page--no-sidebar">
            <div className="container">
              <div className="inner-page__wrapper">
                <button
                  className="btn-flat inner-page__back"
                  type="button"
                  onClick={onBtnBackClickHandle}
                >
                  <svg width="14" height="10" aria-hidden="true">
                    <use xlinkHref="#arrow-left"></use>
                  </svg>
                  <span>Назад</span>
                </button>
                {
                  user.role === Role.Trainer
                    ? <CoachInfoBlock user={user} myRole={myProfile.role} />
                    : <UserInfoBlock user={user} myRole={myProfile.role} myId={myProfile.userId} />
                }
              </div>
            </div>
          </div>
        </main>
      </div>
    </Fragment>
  );
}
