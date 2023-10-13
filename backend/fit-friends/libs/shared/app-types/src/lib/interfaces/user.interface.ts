import { Gender, Role, Location } from '../..';

export interface User {
  readonly userId: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  hashPassword: string;
  gender: Gender;
  role: Role;
  aboutInfo: string;
  birthDate?: Date | null;
  location: Location;
  backgroundImage: string;
  createdAt?: Date | null;
}
