import { Role } from '..';

export type RefreshTokenPayload = {
  sub: number;
  tokenId: string;
};

export type AccessTokenPayload = {
  sub: number;
  role: Role;
  email: string;
  name: string;
};
