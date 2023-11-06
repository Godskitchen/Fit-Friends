import { Gender, Role, Location } from '@libs/shared/app-types';
import { UserProfileRdo } from './user-profile.rdo';
import { TrainerProfileRdo } from './trainer-profile.rdo';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserRdo {
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
  userProfile: UserProfileRdo;

  @ApiPropertyOptional({ type: TrainerProfileRdo })
  @Expose({ groups: [Role.Trainer] })
  @Type(() => TrainerProfileRdo)
  trainerProfile: TrainerProfileRdo;

  @ApiProperty({ example: 'someaccesstokenvalue' })
  @Expose()
  accessToken: string;
}
