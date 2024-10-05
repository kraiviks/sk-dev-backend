import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
// initialize Prisma Client
const prisma = new PrismaClient();

const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 10);
};

async function main() {
  // create two dummy articles
  const user1 = await prisma.user.upsert({
    where: { username: 'user1' },
    update: {},
    create: {
      username: 'user1',
      firstname: 'user1',
      lastname: 'user1',
      email: 'user1@aniviks.com',
      avatar:
        'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg',
      password: await hashPassword('user1-password'),
    },
  });
  const user2 = await prisma.user.upsert({
    where: { username: 'user2' },
    update: {},
    create: {
      username: 'user2',
      firstname: 'user2',
      lastname: 'user2',
      email: 'user2@aniviks.com',
      avatar:
        'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg',
      password: await hashPassword('user2-password'),
    },
  });
  const user3 = await prisma.user.upsert({
    where: { username: 'user3' },
    update: {},
    create: {
      username: 'user3',
      firstname: 'user3',
      lastname: 'user3',
      email: 'user3@aniviks.com',
      password: await hashPassword('user3-password'),
    },
  });
  const user4 = await prisma.user.upsert({
    where: { username: 'user4' },
    update: {},
    create: {
      username: 'user4',
      firstname: 'user4',
      lastname: 'user4',
      email: 'user4@aniviks.com',
      password: await hashPassword('user4-password'),
    },
  });
  const user5 = await prisma.user.upsert({
    where: { username: 'user5' },
    update: {},
    create: {
      username: 'user5',
      firstname: 'user5',
      lastname: 'user5',
      email: 'user5@aniviks.com',
      password: await hashPassword('user5-password'),
    },
  });

  console.log({ user1, user2, user3, user4, user5 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
