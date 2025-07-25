import { PrismaClient } from "@prisma/client";
import runUsersSeeder from "./seeders/users.seeder";
import runDepartmentsSeeder from "./seeders/departments.seeder";
import runTeamsSeeder from "./seeders/teams.seeder";
import runTicketsSeeder from "./seeders/tickets.seeder";
import runFilesSeeder from "./seeders/files.seeder";
// Add more as needed

const prisma = new PrismaClient();

async function main() {
  await runUsersSeeder(prisma);
  await runDepartmentsSeeder(prisma);
  await runTeamsSeeder(prisma);
  await runTicketsSeeder(prisma);
  await runFilesSeeder(prisma);
  // Add more as needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
