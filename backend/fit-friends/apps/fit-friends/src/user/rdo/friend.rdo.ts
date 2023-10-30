import { Expose, Transform, Type } from 'class-transformer';
import { TrainerProfileRdo } from './trainer-profile.rdo';
import { UserProfileRdo } from './user-profile.rdo';
import { Gender, Role, TrainingRequestStatus } from '@libs/shared/app-types';

class TrainingRequestRdo {
  @Expose()
  id: string;

  @Expose()
  status: TrainingRequestStatus;
}

export class FriendRdo {
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
  @Transform(({ value, obj }) => (obj.role === Role.User ? value : undefined))
  userProfile: UserProfileRdo;

  @Expose({ groups: [Role.Trainer] })
  @Type(() => TrainerProfileRdo)
  @Transform(({ value, obj }) =>
    obj.role === Role.Trainer ? value : undefined,
  )
  trainerProfile: TrainerProfileRdo;

  @Expose()
  @Type(() => TrainingRequestRdo)
  trainingRequestsAsSender: TrainingRequestRdo[];

  @Expose()
  @Type(() => TrainingRequestRdo)
  trainingRequestsAsRecepient: TrainingRequestRdo[];
}
