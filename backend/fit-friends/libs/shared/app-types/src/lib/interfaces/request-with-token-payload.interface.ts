import { RefreshTokenPayload } from '../token-payload.type';

export interface RequestWithTokenPayload {
  user: RefreshTokenPayload;
}
