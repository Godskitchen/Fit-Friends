import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { SeedModule } from './seed.module';
import { ConfigService } from '@nestjs/config';
import {
  createOrderData,
  createReplyData,
  createTrainerData,
  createTrainingData,
  createUserData,
} from '../mocks/generators.mocks';
import { User, Role, Training, Order } from '@libs/shared/app-types';
import {
  getRandomArrItem,
  getRandomNumber,
  getUniqueRandomArrItems,
} from '@libs/shared/helpers';
import {
  ORDER_MOCKS_COUNT,
  REPLIES_MOCKS_COUNT,
  TRAINING_MOCKS_COUNT,
  USER_PAIR_MOCKS_COUNT,
} from '../mocks/constants';

const prisma = new PrismaClient();

async function seed() {
  const seedingApp = await NestFactory.create(SeedModule, { logger: false });
  const configService = seedingApp.get(ConfigService);

  const host = configService.getOrThrow<string>('application.host');
  const port = configService.getOrThrow<string>('application.port');
  const rootDir = configService.getOrThrow<string>('static.serveRoot');

  const tableNames = [
    'users',
    'trainer_profiles',
    'user_profiles',
    'trainings',
    'orders',
    'user_balances',
    'replies',
    'subscribers',
    '_subscriptions',
    '_friends',
    'user_balances',
    'training_requests',
    'refresh_tokens_data',
  ];

  for (const tableName of tableNames) {
    await prisma.$queryRawUnsafe(
      `Truncate "${tableName}" restart identity cascade;`,
    );
  }
  let entries: Promise<unknown>[] = [];

  for (let i = 0; i < USER_PAIR_MOCKS_COUNT; i++) {
    entries.push(
      createUserData({ host, port, rootDir }).then((user) =>
        prisma.user.create({
          data: {
            ...user,
            userProfile: { create: { ...user.userProfile } },
          },
        }),
      ),
      createTrainerData({ host, port, rootDir }).then((data) =>
        prisma.user.create({
          data: {
            ...data,
            trainerProfile: { create: { ...data.trainerProfile } },
          },
        }),
      ),
    );
  }

  const newUsers = (await Promise.all(entries)) as User[];
  entries = [];
  const users = newUsers.filter((user) => user.role === Role.User);
  const trainers = newUsers.filter((user) => user.role === Role.Trainer);

  for (let i = 0; i < TRAINING_MOCKS_COUNT; i++) {
    const data = createTrainingData({ host, port, rootDir });
    entries.push(
      prisma.training.create({
        data: {
          ...data,
          trainer: {
            connect: { userId: getRandomArrItem(trainers).userId },
          },
        },
      }),
    );
  }

  const trainings = (await Promise.all(entries)) as Training[];
  entries = [];

  for (let i = 0; i < ORDER_MOCKS_COUNT; i++) {
    const data = createOrderData();
    const { price, trainingId } = getRandomArrItem(trainings);
    entries.push(
      prisma.order.create({
        data: {
          ...data,
          price,
          sum: price * data.trainingCount,
          training: { connect: { trainingId } },
          customer: { connect: { userId: getRandomArrItem(users).userId } },
        },
      }),
    );
  }

  const orders = (await Promise.all(entries)) as Order[];
  entries = [];

  for (let i = 0; i < users.length; i++) {
    const { userId } = users[i];
    const { trainingId, trainingCount } = getRandomArrItem(orders);
    entries.push(
      prisma.userBalance.upsert({
        where: { userId_trainingId: { userId, trainingId } },
        create: {
          remainingAmount: trainingCount,
          user: { connect: { userId } },
          training: { connect: { trainingId } },
        },
        update: { remainingAmount: { increment: trainingCount } },
      }),
    );
  }

  await Promise.all(entries);
  entries = [];

  for (let i = 0; i < REPLIES_MOCKS_COUNT; i++) {
    const data = createReplyData();
    entries.push(
      prisma.reply.create({
        data: {
          ...data,
          author: { connect: { userId: getRandomArrItem(users).userId } },
          training: {
            connect: { trainingId: getRandomArrItem(trainings).trainingId },
          },
        },
      }),
    );
  }

  await Promise.all(entries);
  entries = [];

  for (let i = 0; i < users.length; i++) {
    const { email } = users[i];
    const subscriptions = getUniqueRandomArrItems(
      getRandomNumber(0, 3),
      trainers,
    ).map(({ userId }) => ({ userId }));
    if (subscriptions.length === 0) {
      continue;
    }
    entries.push(
      prisma.subscriber.create({
        data: {
          email,
          subscribedTo: { connect: subscriptions },
        },
      }),
    );
  }

  await Promise.all(entries);
  entries = [];
}

seed()
  .then(() => {
    console.log('База данных была успешно заполнена');
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
