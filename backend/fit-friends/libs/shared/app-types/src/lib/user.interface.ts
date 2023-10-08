import { Role } from './role.enum';
import { Gender } from './gender.enum';
import { Location } from './location.enum';
import { UserProfile } from './user-profile.interface';
import { TrainerProfile } from './trainer-profile.interface';

export interface User {
  readonly userId: number;
  name: string;
  email: string;
  avatarUrl?: string;
  hashPassword: string;
  gender: Gender;
  role: Role;
  aboutInfo: string;
  birthDate?: Date;
  location: Location;
  backgroundImage: string;
  createdAt?: Date;
  userProfile?: UserProfile;
  trainerProfile?: TrainerProfile;
}
