import { AccessTokenPayload, RefreshTokenPayload } from '../token-payload.type';

export interface RequestWithRefreshTokenPayload {
  user: RefreshTokenPayload;
}

export interface RequestWithAccessTokenPayload {
  user: AccessTokenPayload;
}
