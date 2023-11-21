import { Gender, Role, Location } from '@libs/shared/app-types';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  Length,
  Matches,
  MaxDate,
  isDateString,
  maxLength,
} from 'class-validator';
import {
  ABOUT_INFO_LENGTH,
  ABOUT_INFO_VALIDATION_MESSAGE,
  BIRTH_DATE_PATTERN,
  BIRTH_DATE_VALIDATION_MESSAGE,
  EMAIL_VALIDATION_MESSAGE,
  GENDER_VALIDATION_MESSAGE,
  IMAGE_FILE_NAME_PATTERN,
  IMAGE_FILE_VALIDATION_MESSAGE,
  ImageFormats,
  LOCATION_VALIDATION_MESSAGE,
  MAX_DATE_STRING_LENGTH,
  MAX_DATE_TIMESTAMP,
  MIN_DATE_TIMESTAMP,
  NAME_LENGTH,
  NAME_PATTERN,
  NAME_VALIDATION_MESSAGE,
  PASSWORD_LENGTH,
  PASSWORD_VALIDATION_MESSAGE,
  ROLE_VALIDATION_MESSAGE,
} from './constants';
import { Transform } from 'class-transformer';
import dayjs from 'dayjs';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NewUserDto {
  @ApiProperty({
    description: `Имя пользователя от ${NAME_LENGTH.MIN} до ${NAME_LENGTH.MAX} символов русского или английского алфавита`,
    pattern: NAME_PATTERN,
    example: 'Сергей',
  })
  @Matches(RegExp(NAME_PATTERN), { message: NAME_VALIDATION_MESSAGE })
  name: string;

  @ApiProperty({
    description: 'Валидный Email пользователя',
    format: 'email',
    example: 'user@mail.local',
  })
  @IsEmail({}, { message: EMAIL_VALIDATION_MESSAGE })
  email: string;

  @ApiPropertyOptional({
    description: `Наименование изображения аватара. Файл должен быть предварительно загружен на сервер. Доступные форматы: ${ImageFormats.join(
      ',',
    )}. При отсутствии свойства, пользователю будет предоставлен аватар по умолчанию`,
    pattern: IMAGE_FILE_NAME_PATTERN,
    example: 'avatar.jpg',
  })
  @Matches(RegExp(IMAGE_FILE_NAME_PATTERN, 'i'), {
    message: IMAGE_FILE_VALIDATION_MESSAGE,
  })
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    minLength: PASSWORD_LENGTH.MIN,
    maxLength: PASSWORD_LENGTH.MAX,
    example: 'qwerty123',
  })
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX, {
    message: PASSWORD_VALIDATION_MESSAGE,
  })
  password: string;

  @ApiProperty({
    description: `Пол пользователя. Доступные варианты: ${Object.values(
      Gender,
    ).join(',')}`,
    enum: Gender,
    example: Gender.Male,
  })
  @IsEnum(Gender, { message: GENDER_VALIDATION_MESSAGE })
  gender: Gender;

  @ApiProperty({
    description: `Роль пользователя. Доступные варианты: ${Object.values(
      Role,
    ).join(',')}`,
    enum: Role,
    example: Role.Trainer,
  })
  @IsEnum(Role, { message: ROLE_VALIDATION_MESSAGE })
  role: Role;

  @ApiPropertyOptional({
    description: 'Описание пользователя',
    minimum: ABOUT_INFO_LENGTH.MIN,
    maximum: ABOUT_INFO_LENGTH.MAX,
    example: 'Подробное описание пользователя',
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
  })
  @IsEnum(Location, { message: LOCATION_VALIDATION_MESSAGE })
  location: Location;
}
