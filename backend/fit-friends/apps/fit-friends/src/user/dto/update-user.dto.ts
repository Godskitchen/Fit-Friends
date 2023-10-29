import { Transform, Type } from 'class-transformer';
import {
  Matches,
  IsOptional,
  Length,
  IsEnum,
  MaxDate,
  IsDate,
  isDateString,
  maxLength,
  ValidateNested,
} from 'class-validator';
import dayjs from 'dayjs';
import {
  NAME_PATTERN,
  NAME_VALIDATION_MESSAGE,
  IMAGE_FILE_NAME_PATTERN,
  IMAGE_FILE_VALIDATION_MESSAGE,
  GENDER_VALIDATION_MESSAGE,
  ABOUT_INFO_LENGTH,
  ABOUT_INFO_VALIDATION_MESSAGE,
  BIRTH_DATE_VALIDATION_MESSAGE,
  MAX_DATE_STRING_LENGTH,
  LOCATION_VALIDATION_MESSAGE,
} from './constants';
import { Gender, Location } from '@libs/shared/app-types';
import { UpdateUserProfileDto } from './update-user-profile.dto';
import { UpdateTrainerProfileDto } from './update-trainer-profile.dto';

export class UpdateUserDto {
  @Matches(NAME_PATTERN, { message: NAME_VALIDATION_MESSAGE })
  @IsOptional()
  name?: string;

  @Matches(IMAGE_FILE_NAME_PATTERN, { message: IMAGE_FILE_VALIDATION_MESSAGE })
  @IsOptional()
  avatar?: string;

  @IsEnum(Gender, { message: GENDER_VALIDATION_MESSAGE })
  @IsOptional()
  gender?: Gender;

  @Length(ABOUT_INFO_LENGTH.MIN, ABOUT_INFO_LENGTH.MAX, {
    message: ABOUT_INFO_VALIDATION_MESSAGE,
  })
  @IsOptional()
  aboutInfo?: string;

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
  @IsOptional()
  location?: Location;

  @ValidateNested()
  @Type(() => UpdateUserProfileDto)
  @IsOptional()
  userProfile?: UpdateUserProfileDto;

  @ValidateNested()
  @Type(() => UpdateTrainerProfileDto)
  @IsOptional()
  trainerProfile?: UpdateTrainerProfileDto;
}
