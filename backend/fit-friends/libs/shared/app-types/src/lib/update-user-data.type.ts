import { Gender, TrainerProfile, UserProfile } from '..';

export type UpdateUserData = {
  name: string;
  avatarUrl: string;
  gender: Gender;
  aboutInfo: string;
  birthDate: Date;
  location: Location;
  backgroundImage: string;
  userProfile: Omit<Partial<UserProfile>, 'profileId'>;
  trainerProfile: Omit<Partial<TrainerProfile>, 'profileId'>;
};
