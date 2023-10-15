import { Gender, Role, Location } from '@libs/shared/app-types';
import { UserProfileDto } from './user-profile.dto';
import { TrainerProfileDto } from './trainer-profile.dto';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  Length,
  Matches,
  MaxDate,
  ValidateNested,
  isDateString,
  maxLength,
} from 'class-validator';
import {
  ABOUT_INFO_LENGTH,
  ABOUT_INFO_VALIDATION_MESSAGE,
  BIRTH_DATE_VALIDATION_MESSAGE,
  EMAIL_VALIDATION_MESSAGE,
  GENDER_VALIDATION_MESSAGE,
  IMAGE_FILE_NAME_PATTERN,
  IMAGE_FILE_VALIDATION_MESSAGE,
  LOCATION_VALIDATION_MESSAGE,
  MAX_DATE_STRING_LENGTH,
  NAME_PATTERN,
  NAME_VALIDATION_MESSAGE,
  PASSWORD_LENGTH,
  PASSWORD_VALIDATION_MESSAGE,
  ROLE_VALIDATION_MESSAGE,
} from './constants';
import { Transform, Type } from 'class-transformer';
import dayjs from 'dayjs';
import { IsRedundant } from '@libs/shared/validate-decorators';

export class NewUserDto {
  @Matches(NAME_PATTERN, { message: NAME_VALIDATION_MESSAGE })
  name: string;

  @IsEmail({}, { message: EMAIL_VALIDATION_MESSAGE })
  email: string;

  @Matches(IMAGE_FILE_NAME_PATTERN, { message: IMAGE_FILE_VALIDATION_MESSAGE })
  @IsOptional()
  avatarUrl?: string;

  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX, {
    message: PASSWORD_VALIDATION_MESSAGE,
  })
  password: string;

  @IsEnum(Gender, { message: GENDER_VALIDATION_MESSAGE })
  gender: Gender;

  @IsEnum(Role, { message: ROLE_VALIDATION_MESSAGE })
  role: Role;

  @Length(ABOUT_INFO_LENGTH.MIN, ABOUT_INFO_LENGTH.MAX, {
    message: ABOUT_INFO_VALIDATION_MESSAGE,
  })
  aboutInfo: string;

  @MaxDate(new Date(), { message: BIRTH_DATE_VALIDATION_MESSAGE })
  @IsDate({ message: BIRTH_DATE_VALIDATION_MESSAGE })
  @Transform(({ value }) =>
    isDateString(value, { strictSeparator: true }) &&
    maxLength(value, MAX_DATE_STRING_LENGTH)
      ? dayjs(value).toDate()
      : value,
  )
  @IsOptional()
  birthDate?: Date;

  @IsEnum(Location, { message: LOCATION_VALIDATION_MESSAGE })
  location: Location;

  @Matches(IMAGE_FILE_NAME_PATTERN, { message: IMAGE_FILE_VALIDATION_MESSAGE })
  backgroundImage: string;

  @ValidateNested()
  @IsRedundant()
  @Type(() => UserProfileDto)
  @IsOptional()
  userProfile?: UserProfileDto;

  @ValidateNested()
  @IsRedundant()
  @Type(() => TrainerProfileDto)
  @IsOptional()
  trainerProfile?: TrainerProfileDto;
}
