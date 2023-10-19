import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppConfigsModule } from '@libs/config-service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy, LocalStrategy } from '@libs/shared/strategies';
import { UserModule } from '@app/user';
import { RefreshTokenModule } from '@app/refresh-token';
import { DatabaseModule, RefreshTokenRepository } from '@libs/database-service';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UserModule),
    RefreshTokenModule,
    AppConfigsModule,
    JwtModule,
  ],
  providers: [
    RefreshTokenRepository,
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
