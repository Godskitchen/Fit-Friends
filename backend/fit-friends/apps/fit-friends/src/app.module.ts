import { AppConfigsModule } from '@libs/config-service';
import { Module } from '@nestjs/common';
import { RefreshTokenModule } from './refresh-token';
import { UserModule } from './user';
import { AuthModule } from './auth';
import { TrainingModule } from './training';

@Module({
  imports: [
    AppConfigsModule,
    RefreshTokenModule,
    UserModule,
    AuthModule,
    TrainingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
