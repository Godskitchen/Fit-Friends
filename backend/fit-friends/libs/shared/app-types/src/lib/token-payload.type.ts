import { Role } from '..';

export type RefreshTokenPayload = {

};

export type AccessTokenPayload = {
  sub: string;
  role: Role;
  email: string;
  name: string;
};
