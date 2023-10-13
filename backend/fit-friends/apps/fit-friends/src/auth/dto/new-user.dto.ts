import { Gender, Role, Location } from '@libs/shared/app-types';
import UserProfileDto from './user-profile.dto';
import TrainerProfileDto from './trainer-profile.dto';

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
  userProfile?: UserProfileDto;
  trainerProfile?: TrainerProfileDto;
}
