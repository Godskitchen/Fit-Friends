import { Navigate } from 'react-router-dom';
import { AuthorizationStatus } from 'src/app-constants';

type PublicRouteProps = {
  authorizationStatus: AuthorizationStatus;
  authRoute: string;
  children: JSX.Element;
}

export default function PublicRoute({ authorizationStatus, children, authRoute }: PublicRouteProps): JSX.Element {

  return (
    authorizationStatus === AuthorizationStatus.NoAuth
      ? children
      : <Navigate to={authRoute} />
  );
}
