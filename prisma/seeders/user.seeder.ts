import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import usersData from '../mocks/user.mock.json';

export const seedUsers = async (prisma: PrismaClient) => {
  const hashedPassword = await bcrypt.hash('password123', 12);

  const usersToCreate = usersData.map(user => ({
    ...user,
    password: hashedPassword,
    role: user.role as Role,
  }));

  const users = await Promise.all(
    usersToCreate.map(userData => prisma.user.create({ data: userData }))
  );

  console.log('✅ Created users');
  return users;
};
