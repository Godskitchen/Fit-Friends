import { Gender, Role, Location, TrainerProfile, UserProfile } from '../..';

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
  trainerProfile?: TrainerProfile | null;
  userProfile?: UserProfile | null;
}
