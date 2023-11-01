import { Module } from '@nestjs/common';
import { RefreshTokenModule } from './refresh-token';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { TrainingModule } from './training';
import { OrderModule } from './order';
import { BalanceModule } from './balance';
import { StaticModule } from './static';
import { MessageModule } from './message';
import { TrainingRequestModule } from './training-request';
import { ReplyModule } from './reply';
import { MailModule } from './mail';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    RefreshTokenModule,
    AuthModule,
    UserModule,
    TrainingModule,
    OrderModule,
    BalanceModule,
    StaticModule,
    MessageModule,
    TrainingRequestModule,
    ReplyModule,
    MailModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
