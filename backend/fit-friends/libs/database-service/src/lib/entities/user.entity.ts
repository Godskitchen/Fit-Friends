import { User } from '@libs/shared/app-types';
import { Gender } from '@libs/shared/app-types/lib/gender.enum';
import { TrainerProfile } from '@libs/shared/app-types/lib/interfaces/trainer-profile.interface';
import { UserProfile } from '@libs/shared/app-types/lib/interfaces/user-profile.interface';
import { Location } from '@libs/shared/app-types/lib/location.enum';
import { Role } from '@libs/shared/app-types/lib/role.enum';

export class UserEntity implements Omit<User, 'userId'> {
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

  constructor(user: Omit<User, 'userId'>) {
    this.name = user.name;
    this.email = user.email;
    this.avatarUrl = user.avatarUrl;
    this.hashPassword = user.hashPassword;
    this.gender = user.gender;
    this.role = user.role;
    this.aboutInfo = user.aboutInfo;
    this.birthDate = user.birthDate;
    this.location = user.location;
    this.backgroundImage = user.backgroundImage;
    this.userProfile = user.userProfile;
    this.trainerProfile = user.trainerProfile;
  }

  toObject() {
    return {
      name: this.name,
      email: this.email,
      avatarUrl: this.avatarUrl,
      hashPassword: this.hashPassword,
      gender: this.gender,
      role: this.role,
      aboutInfo: this.aboutInfo,
      birthDate: this.birthDate,
      location: this.location,
      backgroundImage: this.backgroundImage,
      userProfile: this.userProfile,
      trainerProfile: this.trainerProfile,
    };
  }
}
