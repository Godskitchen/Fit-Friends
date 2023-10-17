import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {
  DatabaseModule,
  JwtRefreshGuard,
  PublicGuard,
  UserRepository,
} from '@libs/database-service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AppConfigsModule } from '@libs/config-service';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { RefreshTokenModule } from '@app/refresh-token/refresh-token.module';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [DatabaseModule, RefreshTokenModule, AppConfigsModule, UserModule],
  providers: [
    UserRepository,
    AuthService,
    JwtService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshGuard,
    PublicGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
