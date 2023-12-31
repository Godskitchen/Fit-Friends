import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { REFRESH_TOKEN_NAME } from './auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    },
  });
  app.use(cookieParser());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .addCookieAuth(REFRESH_TOKEN_NAME)
    .setTitle('The «Fit Friends» service')
    .setDescription('service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);

  const configService = app.get(ConfigService);

  const host = configService.getOrThrow<string>('application.host');
  const port = configService.getOrThrow<string>('application.port');
  await app.listen(port);

  Logger.log(
    `🚀  Application is running on: http://${host}:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🎯  Current mode: ${configService.getOrThrow<string>(
      'application.environment',
    )}`,
  );
}

bootstrap();
