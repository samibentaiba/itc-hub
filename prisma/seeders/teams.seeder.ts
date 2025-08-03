import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export default async function runTeamsSeeder(prisma: PrismaClient) {
  const filePath = path.join(__dirname, "../data/teams.csv");
  if (!fs.existsSync(filePath)) return;
  const csv = fs.readFileSync(filePath, "utf-8");
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  for (const team of records) {
    const t = team as any;
    const data: any = {
      name: t.name,
      description: t.description,
      status: t.status || undefined,
    };
    if (t.departmentId && t.departmentId.trim()) {
      data.departmentId = t.departmentId;
    } else {
      // Assign to first department if missing
      const firstDept = await prisma.department.findFirst();
      if (firstDept) {
        data.departmentId = firstDept.id;
      }
    }
    await prisma.team.create({ data });
  }
}
