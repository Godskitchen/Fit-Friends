import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import jwtConfig from './jwt.config';
import launchAppConfig from './launch-app.config';
// import staticConfig from './static.config';
// import rabbitConfig from './rabbit.config';
// import rabbitQueueConfig from './rabbit-queue.config';
// import mailerConfig from './mailer.config';

const ENV_PATH = './app.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [launchAppConfig, jwtConfig],
      envFilePath: [ENV_PATH],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppConfigsModule {}
