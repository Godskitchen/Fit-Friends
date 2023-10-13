import { AppConfigsModule } from '@libs/config-service';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AppConfigsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
