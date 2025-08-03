import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export default async function runUsersSeeder(prisma: PrismaClient) {
  const filePath = path.join(__dirname, "../data/users.csv");
  if (!fs.existsSync(filePath)) return;
  const csv = fs.readFileSync(filePath, "utf-8");
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  for (const user of records) {
    const u = user as any;
    // Trim all fields
    Object.keys(u).forEach((k) => {
      if (typeof u[k] === "string") u[k] = u[k].trim();
    });

    const createdUser = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        avatar: u.avatar || undefined,
        status: u.status || undefined,
      },
    });

    // Create Profile
    const profile = await prisma.profile.create({
      data: {
        userId: createdUser.id,
        realName: u.realName || u.name,
        bio: u.bio || null,
        profilePic: null, // Could load from file if needed
      },
    });

    // Create Achievements
    if (u.achievements && u.achievements.trim()) {
      const achievements = u.achievements
        .split(";")
        .map((a: string) => {
          const [badge, description] = a.split(":");
          return {
            badge: badge?.trim() || null,
            description: description?.trim() || null,
            title: description?.trim() || badge?.trim() || "Achievement",
          };
        })
        .filter((a: any) => a.badge || a.title);
      for (const ach of achievements) {
        await prisma.achievement.create({
          data: {
            profileId: profile.id,
            title: ach.title,
            description: ach.description,
            badge: ach.badge,
          },
        });
      }
    }
  }
}
