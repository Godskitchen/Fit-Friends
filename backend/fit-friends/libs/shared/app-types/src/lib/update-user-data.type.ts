import { Gender, Location } from '..';
import { UpdateTrainerProfileData } from './update-trainer-profile-data.type';
import { UpdateUserProfileData } from './update-user-profile.type';

export type UpdateUserData = {
  name?: string;
  avatarUrl?: string;
  gender?: Gender;
  aboutInfo?: string;
  birthDate?: Date;
  location?: Location;
  backgroundImage?: string;
  userProfile?: UpdateUserProfileData;
  trainerProfile?: UpdateTrainerProfileData;
};
