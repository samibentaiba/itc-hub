import { PrismaClient } from '@prisma/client';
import {
  seedUsers,
  seedDepartments,
  seedTeams,
  seedDepartmentMembers,
  seedTeamMembers,
  seedTickets,
  seedMessages,
  seedEvents,
  seedNotifications,
} from './seeders';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data in proper order to avoid foreign key conflicts
  await prisma.file.deleteMany();
  await prisma.message.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.departmentMember.deleteMany();
  await prisma.event.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.team.deleteMany();
  await prisma.department.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  await seedUsers(prisma);
  await seedDepartments(prisma);
  await seedTeams(prisma);
  await seedDepartmentMembers(prisma);
  await seedTeamMembers(prisma);
  await seedTickets(prisma);
  await seedMessages(prisma);
  await seedEvents(prisma);
  await seedNotifications(prisma);

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user: sami.bentaiba@example.com / password123');
  console.log('👤 Manager user: jane.doe@example.com / password123');
  console.log('👤 Regular user: john.smith@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });