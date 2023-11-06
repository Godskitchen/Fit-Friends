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
  NAME_LENGTH,
  ImageFormats,
  BIRTH_DATE_PATTERN,
  MAX_DATE_TIMESTAMP,
  MIN_DATE_TIMESTAMP,
} from './constants';
import { Gender, Location, Role } from '@libs/shared/app-types';
import { UpdateUserProfileDto } from './update-user-profile.dto';
import { UpdateTrainerProfileDto } from './update-trainer-profile.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: `Имя пользователя от ${NAME_LENGTH.MIN} до ${NAME_LENGTH.MAX} символов русского или английского алфавита`,
    pattern: NAME_PATTERN,
    example: 'Сергей',
    required: false,
  })
  @Matches(RegExp(NAME_PATTERN), { message: NAME_VALIDATION_MESSAGE })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: `Наименование изображения аватара. Файл должен быть предварительно загружен на сервер. Доступные форматы: ${ImageFormats.join(
      ',',
    )}.`,
    pattern: IMAGE_FILE_NAME_PATTERN,
    example: 'avatar.jpg',
    required: false,
  })
  @Matches(RegExp(IMAGE_FILE_NAME_PATTERN, 'i'), {
    message: IMAGE_FILE_VALIDATION_MESSAGE,
  })
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: `Пол пользователя. Доступные варианты: ${Object.values(
      Gender,
    ).join(',')}`,
    enum: Gender,
    example: Gender.Male,
    required: false,
  })
  @IsEnum(Gender, { message: GENDER_VALIDATION_MESSAGE })
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    description: 'Описание пользователя',
    minimum: ABOUT_INFO_LENGTH.MIN,
    maximum: ABOUT_INFO_LENGTH.MAX,
    example: 'Подробное описание пользователя',
    required: false,
  })
  @Length(ABOUT_INFO_LENGTH.MIN, ABOUT_INFO_LENGTH.MAX, {
    message: ABOUT_INFO_VALIDATION_MESSAGE,
  })
  @IsOptional()
  aboutInfo?: string;

  @ApiPropertyOptional({
    description:
      'Дата рождения пользователя в сокращенном ISO-формате: YYYY-MM-DD. Не может быть позже текущей даты. Опционально',
    format: 'Date',
    pattern: BIRTH_DATE_PATTERN,
    minimum: MIN_DATE_TIMESTAMP,
    maximum: MAX_DATE_TIMESTAMP,
    example: '2000-03-10',
    required: false,
  })
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

  @ApiProperty({
    description: `Локация пользователя, станция метро. Доступные варианты: ${Object.values(
      Location,
    ).join(',')}`,
    enum: Location,
    example: Location.Pionerskaya,
    required: false,
  })
  @IsEnum(Location, { message: LOCATION_VALIDATION_MESSAGE })
  @IsOptional()
  location?: Location;

  @ApiPropertyOptional({
    description: `Опросник для пользователя. Свойство допускается только для пользователя с ролью ${Role.User}`,
    type: [UpdateUserProfileDto],
    required: false,
  })
  @ValidateNested()
  @Type(() => UpdateUserProfileDto)
  @IsOptional()
  userProfile?: UpdateUserProfileDto;

  @ApiPropertyOptional({
    description: `Опросник для тренера. Свойство допускается только для пользователя с ролью ${Role.Trainer}`,
    type: [UpdateTrainerProfileDto],
    required: false,
  })
  @ValidateNested()
  @Type(() => UpdateTrainerProfileDto)
  @IsOptional()
  trainerProfile?: UpdateTrainerProfileDto;
}
