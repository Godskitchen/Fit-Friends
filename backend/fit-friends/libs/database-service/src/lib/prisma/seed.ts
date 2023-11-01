import { getRandomArrItem } from '@libs/shared/helpers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function seed() {
  const users = await prisma.user.findMany();
  console.log(getRandomArrItem(users));
}

seed();
