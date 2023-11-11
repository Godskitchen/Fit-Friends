import { Module } from '@nestjs/common';
import { AppConfigsModule } from '@libs/config-service';
import { DatabaseModule, FileDataRepository } from '@libs/database-service';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StaticService } from './static.service';
import { StaticController } from './static.controller';
import { DEFAULT_FILES_ROOT_PATH } from './static.constants';

@Module({
  imports: [
    DatabaseModule,
    AppConfigsModule,
    ServeStaticModule.forRootAsync({
      imports: [AppConfigsModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rootPath = configService.getOrThrow<string>(
          'static.uploadDirectory',
        );
        const serveRoot = configService.getOrThrow<string>('static.serveRoot');
        const defaultRenderPath = DEFAULT_FILES_ROOT_PATH.split('/').pop();
        return [
          {
            rootPath,
            serveRoot,
            renderPath: serveRoot,
            serveStaticOptions: {
              fallthrough: true,
              etag: true,
            },
          },
          {
            rootPath: DEFAULT_FILES_ROOT_PATH,
            serveRoot,
            renderPath: `/${defaultRenderPath}`,
            serveStaticOptions: {
              fallthrough: true,
              etag: true,
            },
          },
        ];
      },
    }),
  ],
  providers: [StaticService, FileDataRepository],
  controllers: [StaticController],
  exports: [StaticService],
})
export class StaticModule {}
