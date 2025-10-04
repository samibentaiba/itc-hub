import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const department = await prisma.department.findUnique({
    where: { id: 'DEP-001' },
    include: {
      events: true,
    },
  });

  console.log(department?.events);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
