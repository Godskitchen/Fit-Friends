import { Gender, Role, Location } from '@libs/shared/app-types';
import { TrainerProfile } from '@libs/shared/app-types/lib/interfaces/trainer-profile.interface';
import { UserProfile } from '@libs/shared/app-types/lib/interfaces/user-profile.interface';

export default class NewUserDto {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  gender: Gender;
  role: Role;
  aboutInfo: string;
  birthDate?: Date;
  location: Location;
  backgroundImage: string;
  userProfile?: UserProfile;
  trainerProfile?: TrainerProfile;
}
