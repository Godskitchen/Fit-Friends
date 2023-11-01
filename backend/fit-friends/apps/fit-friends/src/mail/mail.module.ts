import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { getMailerAsyncOptions } from '@libs/shared/helpers';
import {
  DatabaseModule,
  SubscriberRepository,
  UserRepository,
} from '@libs/database-service';
import { AppConfigsModule } from '@libs/config-service';

@Module({
  imports: [
    AppConfigsModule,
    MailerModule.forRootAsync(getMailerAsyncOptions('mailer')),
    DatabaseModule,
  ],
  providers: [MailService, SubscriberRepository, UserRepository],
  controllers: [MailController],
})
export class MailModule {}
