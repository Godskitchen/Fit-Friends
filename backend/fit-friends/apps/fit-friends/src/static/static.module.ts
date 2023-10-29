import { Module } from '@nestjs/common';
import { AppConfigsModule } from '@libs/config-service';
import { DatabaseModule, FileDataRepository } from '@libs/database-service';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StaticService } from './static.service';
import { StaticController } from './static.controller';

@Module({
  imports: [
    DatabaseModule,
    AppConfigsModule,
    ServeStaticModule.forRootAsync({
      imports: [AppConfigsModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rootPath = configService.getOrThrow('static.uploadDirectory');
        const serveRoot = configService.getOrThrow('static.serveRoot');
        return [
          {
            rootPath,
            serveRoot,
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
