import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DatabaseModule, UserRepository } from '@libs/database-service';
import { AuthService } from './auth.service';
import { IsRedundantConstraint } from '@libs/shared/validate-decorators';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserRepository,
    AuthService,
    IsRedundantConstraint,
    LocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
