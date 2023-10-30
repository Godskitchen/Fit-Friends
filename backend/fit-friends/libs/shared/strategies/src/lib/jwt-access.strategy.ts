import { UserService } from '@app/user';
import { AccessTokenPayload } from '@libs/shared/app-types';
import { USER_NOT_FOUND } from '@libs/shared/common';
import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('jwt.accessTokenSecret'),
    });
  }

  public async validate(payload: AccessTokenPayload) {
    await this.userService.getDetails(payload.sub).catch(() => {
      throw new UnauthorizedException(USER_NOT_FOUND);
    });
    return payload;
  }
}
