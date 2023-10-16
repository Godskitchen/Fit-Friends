import { AppConfigsModule } from '@libs/config-service';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

@Module({
  imports: [AppConfigsModule, AuthModule, UserModule, RefreshTokenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
