import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '@libs/shared/app-types';

const USERNAME_FIELD_NAME = 'email';
const PASSWORD_FIELD_NAME = 'password';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: USERNAME_FIELD_NAME,
      passwordField: PASSWORD_FIELD_NAME,
    });
  }

  public async validate(email: string, password: string): Promise<User> {
    return this.authService.authorize({ email, password });
  }
}
