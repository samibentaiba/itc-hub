import { PrismaClient } from '@prisma/client';
import messagesData from '../mocks/message.mock.json';

export const seedMessages = async (prisma: PrismaClient) => {
  const messagesToCreate = messagesData.map(message => ({
    ...message,
    timestamp: new Date(message.timestamp),
  }));

  await Promise.all(
    messagesToCreate.map(messageData => prisma.message.create({ data: messageData }))
  );

  console.log('✅ Created ticket comments');
};