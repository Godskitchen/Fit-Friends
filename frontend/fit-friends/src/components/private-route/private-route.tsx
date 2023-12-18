import { Navigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from 'src/app-constants';

type PrivateRouteProps = {
  restrictedStatus: AuthorizationStatus;
  currentStatus: AuthorizationStatus;
  redirectTo: AppRoute;
  children: JSX.Element;
}

export default function PrivateRoute ({ children, restrictedStatus, currentStatus, redirectTo }: PrivateRouteProps): JSX.Element {
  return (
    currentStatus !== restrictedStatus
      ? children
      : <Navigate to={redirectTo} />
  );
}

