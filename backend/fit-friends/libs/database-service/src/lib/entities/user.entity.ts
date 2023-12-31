import {
  Gender,
  Role,
  User,
  Location,
  TrainerProfile,
  UserProfile,
} from '@libs/shared/app-types';

export class UserEntity implements Omit<User, 'userId'> {
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
  userProfile?: UserProfile | null;
  trainerProfile?: TrainerProfile | null;

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
