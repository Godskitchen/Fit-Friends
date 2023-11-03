import { IsEmail, Length } from 'class-validator';
import {
  EMAIL_VALIDATION_MESSAGE,
  PASSWORD_LENGTH,
  PASSWORD_VALIDATION_MESSAGE,
} from './constants';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Валидный Email пользователя',
    format: 'email',
    example: 'user@mail.local',
  })
  @IsEmail({}, { message: EMAIL_VALIDATION_MESSAGE })
  email: string;

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
}
