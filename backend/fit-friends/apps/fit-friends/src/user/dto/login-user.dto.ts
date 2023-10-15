import { IsEmail, Length } from 'class-validator';
import {
  EMAIL_VALIDATION_MESSAGE,
  PASSWORD_LENGTH,
  PASSWORD_VALIDATION_MESSAGE,
} from './constants';

export class LoginUserDto {
  @IsEmail({}, { message: EMAIL_VALIDATION_MESSAGE })
  email: string;

  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX, {
    message: PASSWORD_VALIDATION_MESSAGE,
  })
  password: string;
}
