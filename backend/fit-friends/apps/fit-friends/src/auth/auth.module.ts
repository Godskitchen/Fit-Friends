import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { DatabaseModule, UserRepository } from '@libs/database-service';
import { AuthService } from './auth.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepository, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
