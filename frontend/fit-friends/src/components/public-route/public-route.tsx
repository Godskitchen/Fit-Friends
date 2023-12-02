import { Navigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from 'src/app-constants';
import { useAppSelector } from 'src/hooks';
import { getUserInfo } from 'src/store/user-process/user-process.selectors';
import LoadingScreen from '../loading-components/loading-screen';

type PublicRouteProps = {
  authorizationStatus: AuthorizationStatus;
  children: JSX.Element;
}

export default function PublicRoute({ authorizationStatus, children }: PublicRouteProps): JSX.Element {
  const userInfo = useAppSelector(getUserInfo);

  if (userInfo === undefined) {
    return <LoadingScreen />;
  }

  return (
    authorizationStatus === AuthorizationStatus.NoAuth
      ? children
      : <Navigate to={AppRoute.Main} />
  );
}
