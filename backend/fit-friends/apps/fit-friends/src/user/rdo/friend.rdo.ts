import { Expose, Transform, Type } from 'class-transformer';
import { TrainerProfileRdo } from './trainer-profile.rdo';
import { UserProfileRdo } from './user-profile.rdo';
import {
  Gender,
  Role,
  TrainingRequestStatus,
  Location,
} from '@libs/shared/app-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TrainingRequestRdo {
  @ApiProperty({
    example: '232k-3klk23-ekl3',
    description: 'id заявки на тренировку',
  })
  @Expose()
  id: string;

  @ApiProperty({
    enum: TrainingRequestStatus,
    example: TrainingRequestStatus.Declined,
    description: `Статус заявки. Возможные значения ${Object.values(
      TrainingRequestStatus,
    ).join(',')}`,
  })
  @Expose()
  status: TrainingRequestStatus;
}

export class FriendRdo {
  @ApiProperty({ example: 2 })
  @Expose()
  userId: number;

  @ApiProperty({ example: 'Сергей' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'user@mail.local' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'static/path/to/avatar.jpg' })
  @Expose()
  avatarUrl: string;

  @ApiProperty({ enum: Gender, example: Gender.Female })
  @Expose()
  gender: Gender;

  @ApiProperty({ enum: Role, example: Role.User })
  @Expose()
  role: Role;

  @ApiProperty({ example: 'Подробное описание пользователя' })
  @Expose()
  aboutInfo: string;

  @ApiPropertyOptional({ example: new Date('2000-03-15').toISOString() })
  @Expose()
  @Transform(({ value }) => (value ? value : undefined))
  birthDate: string;

  @ApiProperty({ enum: Location, example: Location.Pionerskaya })
  @Expose()
  location: Location;

  @ApiProperty({ example: 'static/path/to/back.png' })
  @Expose()
  backgroundImage: string;

  @ApiProperty({ example: new Date().toISOString() })
  @Expose()
  createdAt: string;

  @ApiPropertyOptional({ type: UserProfileRdo })
  @Expose({ groups: [Role.User] })
  @Type(() => UserProfileRdo)
  @Transform(({ value, obj }) => (obj.role === Role.User ? value : undefined))
  userProfile: UserProfileRdo;

  @ApiPropertyOptional({ type: TrainerProfileRdo })
  @Expose({ groups: [Role.Trainer] })
  @Type(() => TrainerProfileRdo)
  @Transform(({ value, obj }) =>
    obj.role === Role.Trainer ? value : undefined,
  )
  trainerProfile: TrainerProfileRdo;

  @ApiProperty({
    type: [TrainingRequestRdo],
    description: 'Заявка на тренировку от друга',
  })
  @Expose()
  @Type(() => TrainingRequestRdo)
  trainingRequestsAsSender: TrainingRequestRdo[];

  @ApiProperty({
    type: [TrainingRequestRdo],
    description: 'Ответ друга на вашу заявку на тренировку.',
  })
  @Expose()
  @Type(() => TrainingRequestRdo)
  trainingRequestsAsRecepient: TrainingRequestRdo[];
}
