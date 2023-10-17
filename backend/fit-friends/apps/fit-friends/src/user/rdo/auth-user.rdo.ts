import { Gender, Role } from '@libs/shared/app-types';
import { UserProfileRdo } from './user-profile.rdo';
import { TrainerProfileRdo } from './trainer-profile.rdo';
import { Expose, Transform, Type } from 'class-transformer';

export class AuthUserRdo {
  @Expose()
  userId: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  gender: Gender;

  @Expose()
  role: Role;

  @Expose()
  aboutInfo: string;

  @Expose()
  @Transform(({ value }) => (value ? value : undefined))
  birthDate: string;

  @Expose()
  location: Location;

  @Expose()
  backgroundImage: string;

  @Expose()
  createdAt: string;

  @Expose({ groups: [Role.User] })
  @Type(() => UserProfileRdo)
  userProfile: UserProfileRdo;

  @Expose({ groups: [Role.Trainer] })
  @Type(() => TrainerProfileRdo)
  trainerProfile: TrainerProfileRdo;

  @Expose()
  accessToken: string;
}
