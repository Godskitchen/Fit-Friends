import { Role } from '../role.enum';
import { Gender } from '../gender.enum';
import { Location } from '../location.enum';
import { UserProfile } from './user-profile.interface';
import { TrainerProfile } from './trainer-profile.interface';

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
  userProfile?: UserProfile | null;
  trainerProfile?: TrainerProfile | null;
}
