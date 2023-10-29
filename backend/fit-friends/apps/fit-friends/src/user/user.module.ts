import { Module } from '@nestjs/common';
import { DatabaseModule, UserRepository } from '@libs/database-service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StaticModule } from '@app/static';
import { MessageModule } from '@app/message';

@Module({
  imports: [DatabaseModule, StaticModule, MessageModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
