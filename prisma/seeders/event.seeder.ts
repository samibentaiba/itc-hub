import { PrismaClient } from '@prisma/client';
import eventsData from '../mocks/event.mock.json';

export const seedEvents = async (prisma: PrismaClient) => {
  const eventsToCreate = eventsData.map(event => ({
    ...event,
    date: new Date(event.date),
  }));

  await Promise.all(
    eventsToCreate.map(eventData => prisma.event.create({ data: eventData }))
  );

  console.log('✅ Created events');
};