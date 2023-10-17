import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';

// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // const config = new DocumentBuilder()
  //   .addBearerAuth()
  //   .setTitle('The «Guitar Shop» service')
  //   .setDescription('service API')
  //   .setVersion('1.0')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('spec', app, document);

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
