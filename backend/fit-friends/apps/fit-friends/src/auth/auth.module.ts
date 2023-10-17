import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {
  DatabaseModule,
  JwtRefreshGuard,
  PublicGuard,
  UserRepository,
} from '@libs/database-service';
import { AuthService } from './auth.service';
import { IsRedundantConstraint } from '@libs/shared/validate-decorators';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { AppConfigsModule } from '@libs/config-service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [DatabaseModule, RefreshTokenModule, AppConfigsModule, UserModule],
  providers: [
    UserRepository,
    AuthService,
    JwtService,
    IsRedundantConstraint,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshGuard,
    PublicGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
