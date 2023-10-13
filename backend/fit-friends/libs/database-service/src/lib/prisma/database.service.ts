import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { getPostgresConnectionString } from '@libs/shared/helpers';

import { DbConfig } from '@libs/shared/app-types';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private psqlConnector: PrismaClient;

  constructor(private configService: ConfigService) {
    this.psqlConnector = new PrismaClient({
      datasources: {
        db: {
          url: getPostgresConnectionString(
            configService.getOrThrow<DbConfig>('postgres-db'),
          ),
        },
      },
    });
  }

  async onModuleInit() {
    await this.psqlConnector.$connect();
  }

  get prismaPostgresConnector(): PrismaClient {
    return this.psqlConnector;
  }
}
