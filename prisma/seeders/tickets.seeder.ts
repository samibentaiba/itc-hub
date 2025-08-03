import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export default async function runTicketsSeeder(prisma: PrismaClient) {
  const filePath = path.join(__dirname, "../data/tickets.csv");
  if (!fs.existsSync(filePath)) return;
  const csv = fs.readFileSync(filePath, "utf-8");
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  for (const ticket of records) {
    const t = ticket as any;
    // Find fallback references if missing
    let teamId = t.teamId && t.teamId.trim() ? t.teamId : undefined;
    let departmentId =
      t.departmentId && t.departmentId.trim() ? t.departmentId : undefined;
    let assigneeId =
      t.assigneeId && t.assigneeId.trim() ? t.assigneeId : undefined;
    let createdById =
      t.createdById && t.createdById.trim() ? t.createdById : undefined;

    if (!teamId) {
      const team = await prisma.team.findFirst();
      if (team) teamId = team.id;
    }
    if (!departmentId) {
      const dept = await prisma.department.findFirst();
      if (dept) departmentId = dept.id;
    }
    if (!assigneeId) {
      const user = await prisma.user.findFirst();
      if (user) assigneeId = user.id;
    }
    if (!createdById) {
      const user = await prisma.user.findFirst();
      if (user) createdById = user.id;
    }

    const data: any = {
      title: t.title,
      description: t.description,
      type: t.type,
      status: t.status,
      teamId,
      departmentId,
      assigneeId,
      createdById,
    };
    if (t.dueDate && !isNaN(Date.parse(t.dueDate))) {
      data.dueDate = new Date(t.dueDate);
    }
    await prisma.ticket.create({ data });
  }
}
