import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import psqlConnectorConfig from './psql-connector.config';

const ENV_PATH = './app.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [psqlConnectorConfig],
      envFilePath: [ENV_PATH],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigDbModule {}
