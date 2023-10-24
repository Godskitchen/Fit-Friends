import { Module } from '@nestjs/common';
import { RefreshTokenModule } from './refresh-token';
import { UserModule } from './user';
import { AuthModule } from './auth';
import { TrainingModule } from './training';
import { OrderModule } from './order';

@Module({
  imports: [
    RefreshTokenModule,
    UserModule,
    AuthModule,
    TrainingModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
