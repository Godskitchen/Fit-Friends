import { Module } from '@nestjs/common';
import { DatabaseModule, UserRepository } from '@libs/database-service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepository, UserService],
  controllers: [UserController],
})
export class UserModule {}
