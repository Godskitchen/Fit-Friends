import { Gender, Role } from './constants';

export type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  birthday?: string;
  location: string;
  gender: Gender;
  role: Role;
  avatar?: FileList;
  agreement: boolean;
};

export type LoginInputs = {
  email: string;
  password: string;
}
