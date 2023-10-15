import { AppConfigsModule } from '@libs/config-service';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AppConfigsModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
