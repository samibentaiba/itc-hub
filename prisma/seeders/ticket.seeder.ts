import { PrismaClient, TicketType, TicketStatus, TicketPriority } from '@prisma/client';
import ticketsData from '../mocks/ticket.mock.json';

export const seedTickets = async (prisma: PrismaClient) => {
  const ticketsToCreate = ticketsData.map(ticket => ({
    ...ticket,
    createdAt: new Date(ticket.createdAt),
    updatedAt: new Date(ticket.updatedAt),
    type: ticket.type as TicketType,
    status: ticket.status as TicketStatus,
    priority: ticket.priority as TicketPriority,
  }));

  await Promise.all(
    ticketsToCreate.map(ticketData => prisma.ticket.create({ data: ticketData }))
  );

  console.log('✅ Created tickets');
};
