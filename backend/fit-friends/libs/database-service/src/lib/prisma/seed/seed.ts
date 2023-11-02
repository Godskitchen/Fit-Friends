import { getRandomArrItem } from '@libs/shared/helpers';
import { NestApplication, NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { SeedModule } from './seed.module';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database.service';

const prisma = new PrismaClient();
async function seed() {
  const seedingApp = await NestFactory.create(SeedModule);
  const configService = seedingApp.get(ConfigService);

  const users = await prisma.user.findMany();
  console.log(users);

  const host = configService.getOrThrow<string>('application.host');
  const port = configService.getOrThrow<string>('application.port');
  console.log(port);
}

seed();
