import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { User } from '@libs/shared/app-types';
import { AuthService } from '@app/auth';

const USERNAME_FIELD_NAME = 'email';
const PASSWORD_FIELD_NAME = 'password';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: USERNAME_FIELD_NAME,
      passwordField: PASSWORD_FIELD_NAME,
    });
  }

  public async validate(email: string, password: string): Promise<User> {
    return this.authService.authorize({ email, password });
  }
}
