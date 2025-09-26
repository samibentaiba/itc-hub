// prisma\seed.ts
import bcrypt from "bcryptjs";
import usersData from "./mocks/user.mock";
import departmentsData from "./mocks/department.mock";
import teamsData from "./mocks/team.mock";
import departmentMembersData from "./mocks/departmentMember.mock";
import teamMembersData from "./mocks/teamMember.mock";
import ticketsData from "./mocks/ticket.mock";
import messagesData from "./mocks/message.mock";
import eventsData from "./mocks/event.mock";
import notificationsData from "./mocks/notification.mock";
import { PrismaClient } from "@prisma/client";

class Seeder {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async run() {
    console.log("🌱 Starting database seed...");
    await this.clearDatabase();
    await this.seedUsers();
    await this.seedDepartments();
    await this.seedTeams();
    await this.seedDepartmentMembers();
    await this.seedTeamMembers();
    await this.seedTickets();
    await this.seedMessages();
    await this.seedAppSecrets();

    await this.seedEvents();
    await this.seedNotifications();
    console.log("✅ Database seeded successfully!");
    console.log("👤 Admin user: sami.bentaiba@example.com / password123");
    console.log("👤 Manager user: jane.doe@example.com / password123");
    console.log("👤 Regular user: john.smith@example.com / password123");
  }

  private async clearDatabase() {
    console.log("🧹 Clearing database...");
    await this.prisma.file.deleteMany();
    await this.prisma.message.deleteMany();
    await this.prisma.ticket.deleteMany();
    await this.prisma.teamMember.deleteMany();
    await this.prisma.departmentMember.deleteMany();
    await this.prisma.event.deleteMany();
    await this.prisma.notification.deleteMany();
    await this.prisma.achievement.deleteMany();
    await this.prisma.passwordResetToken.deleteMany();
    await this.prisma.appSecret.deleteMany();
    await this.prisma.profile.deleteMany();
    await this.prisma.team.deleteMany();
    await this.prisma.department.deleteMany();
    await this.prisma.session.deleteMany();
    await this.prisma.account.deleteMany();
    await this.prisma.user.deleteMany();
  }

  private async seedUsers() {
    const hashedPassword = await bcrypt.hash("password123", 12);

    const usersToCreate = usersData.map((user) => ({
      ...user,
      password: hashedPassword,
      emailVerified: new Date(), // ✅ every seeded user is marked verified
    }));

    await Promise.all(
      usersToCreate.map((data) =>
        this.prisma.user.create({
          data,
        })
      )
    );

    console.log("✅ Created users");
  }

  private async seedDepartments() {
    await Promise.all(
      departmentsData.map((data) => this.prisma.department.create({ data }))
    );
    console.log("✅ Created departments");
  }

  private async seedTeams() {
    await Promise.all(
      teamsData.map((data) => this.prisma.team.create({ data }))
    );
    console.log("✅ Created teams");
  }

  private async seedDepartmentMembers() {
    await Promise.all(
      departmentMembersData.map((data) =>
        this.prisma.departmentMember.create({ data })
      )
    );
    console.log("✅ Created department memberships");
  }

  private async seedTeamMembers() {
    await Promise.all(
      teamMembersData.map((data) => this.prisma.teamMember.create({ data }))
    );
    console.log("✅ Created team memberships");
  }

  private async seedTickets() {
    await Promise.all(
      ticketsData.map((data) => this.prisma.ticket.create({ data }))
    );
    console.log("✅ Created tickets");
  }

  private async seedMessages() {
    await Promise.all(
      messagesData.map((data) => this.prisma.message.create({ data }))
    );
    console.log("✅ Created ticket comments");
  }

  private async seedEvents() {
    const eventsToCreate = eventsData.map((event: any) => ({
      ...event,
      type: event.type.toUpperCase(),
    }));

    await Promise.all(
      eventsToCreate.map((data) => this.prisma.event.create({ data }))
    );
    console.log("✅ Created events");
  }

  private async seedNotifications() {
    await Promise.all(
      notificationsData.map((data) => this.prisma.notification.create({ data }))
    );
    console.log("✅ Created notifications");
  }

  private async seedAppSecrets() {
    const secrets = [
      { key: "EMAIL_HOST", value: "smtp.gmail.com" },
      { key: "EMAIL_PORT", value: "587" },
      { key: "EMAIL_SECURE", value: "false" },
      { key: "EMAIL_USER", value: "your-account@gmail.com" },
      { key: "EMAIL_PASSWORD", value: "your-app-password" },
      { key: "EMAIL_FROM", value: "ITC Hub <noreply@itchub.com>" },
      { key: "APP_BASE_URL", value: "http://localhost:3000" },
    ];

    await Promise.all(
      secrets.map((s) =>
        this.prisma.appSecret.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: s,
        })
      )
    );

    console.log("✅ Created app secrets");
  }

  public async disconnect() {
    await this.prisma.$disconnect();
  }
}

const seeder = new Seeder();

seeder
  .run()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await seeder.disconnect();
  });
